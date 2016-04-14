import * as _ from 'underscore';
import * as deepEqual from 'deep-equal';
import { Condition, RuleAsyncWithName, RuleAsync, RuleSync, RuleLikeSync, RuleLikeAsync, RuleResultOf, IConditionService } from './Interfaces';



export class ConditionService<TState> implements IConditionService<TState> {


    toRule = (func: RuleAsync<TState>): RuleAsyncWithName<TState> => {
        const rule: RuleAsyncWithName<TState> = <any>func;
        // wtf ? :D write a test
        rule.modify = (transform: (e: TState) => TState) => (state: TState | RuleResultOf<TState>) => func(state).then(result => result.$result === true ? this.toResult(transform(this.toState(result)), result.$result) : result);
        return rule;
    };

    toResult: (stateOrResult: TState | RuleResultOf<TState>, result: boolean) => RuleResultOf<TState> = (state, result) => {
        let r = (state as RuleResultOf<TState>);
        if (r && r.$state) {
            return _.extend({}, this, {
                $state: r.$state,
                $result: result
            })
        } else {
            return _.extend({}, this, {
                $state: state,
                $result: result
            })
        }
    };
    toState: (stateOrResult: TState | RuleResultOf<TState>) => TState = (state) => {
        let r = (state as RuleResultOf<TState>);
        if (!r) {
            return <TState>state;
        }
        if (r && r.$state) {
            return <TState>_.extend({}, r.$state);
        }
        else {
            return <TState>_.extend({}, state);
        }
    }

    private _equal: (valueA, valueB) => boolean = null;
    private _setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
    private _unwrapGroup = (rules: RuleAsync<TState>[], state: TState | RuleResultOf<TState>): Promise<RuleResultOf<TState>[]> => Promise.all(rules.map(rule => rule(state)));


    never = () => this.toRule((state: TState | RuleResultOf<TState>) => Promise.resolve(this.toResult(state, false)));
    always = () => this.toRule((state: TState | RuleResultOf<TState>) => Promise.resolve(this.toResult(state, true)));

    equals = (value: TState | RuleResultOf<TState>) => this.toRule((state: TState | RuleResultOf<TState>) => {
        const result = deepEqual(this.toState(value), this.toState(state));
        return Promise.resolve(this.toResult(state, result));
    });

    all = (rules: RuleAsync<TState>[]) => this.toRule((state: TState | RuleResultOf<TState>) =>
        this._unwrapGroup(rules, this.toState(state))
            .then(ruleResults => {
                const result = ruleResults.map(e => e.$result).reduce((last, current) => last && current, true);
                return this.toResult(state, result);
            }));

    and = this.all;

    some = (rules: RuleAsync<TState>[]) => this.toRule((state: TState | RuleResultOf<TState>) =>
        this._unwrapGroup(rules, this.toState(state))
            .then(ruleResults => this.toResult(state, (ruleResults.filter(e => e.$result).length > 0))));

    any = this.some;

    or = this.some;

    not = (rule: RuleAsync<TState>) => this.toRule((state: TState | RuleResultOf<TState>) =>
        rule(this.toState(state))
            .then(result => this.toResult(state, !result.$result)));

    is = (rule: (TState) => boolean) => this.toRule((state: TState | RuleResultOf<TState>) => {
        const result = rule ? rule(this.toState(state)) : false;
        return Promise.resolve(this.toResult(state, result));
    });

    sync = this.is;

    async = (ruleLike: RuleLikeAsync<TState> | RuleAsync<TState>) => this.toRule((state: TState | RuleResultOf<TState>) =>
        ruleLike(this.toState(state))
            .then(result => this.toResult(state, !!result))
            .catch(e => this.toResult(state, false)));



    waitFor = this.async;

    timeout = ({ ms, $if, $when }: { ms: number, $if?: RuleLikeAsync<TState>, $when?: RuleLikeAsync<TState> }) => this.toRule((state: TState | RuleResultOf<TState>) =>
        new Promise<RuleResultOf<TState>>((resolve, reject) => {

            const rule = $if || $when || this.never();

            let isResolve = false;

            const timerId = this._setTimeout(() => {
                // console.log('resolving from TIMEOUT');
                if (!isResolve) {
                    isResolve = true;
                    resolve(this.toResult(state, false));
                }
            }, ms);

            this.async(rule)(this.toState(state))
                .then(result => {
                    if (!isResolve) {
                        //  console.log('resolving from PROMISE');
                        clearTimeout(timerId);
                        isResolve = true;
                        resolve(result);
                    }
                });

        }));


    waitForOrSkip = this.timeout;

    has = (query: { [key: string]: Object }) => this.toRule((state: TState | RuleResultOf<TState>) => {
        let result = true;
        Object.keys(query).forEach(key => {
            result = result && (Object.keys(state).indexOf(key) > -1) && this._equal(state[key], query[key]);
        });
        return Promise.resolve(this.toResult(state, result));
    });

    propsAre = this.has;

    constructor(owerwrites: any = {}) {
        this._setTimeout = owerwrites._setTimeout || setTimeout;
        this._equal = owerwrites._equal || deepEqual;
    }
}

export class RuleEngine<T> {
    $if = new ConditionService<T>();
    $when = this.$if;
}
