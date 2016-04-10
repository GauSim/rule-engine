import * as _ from 'underscore';
import * as deepEqual from 'deep-equal';
import { Condition, RuleAsync, RuleSync, RuleLikeSync, RuleLikeAsync, IConditionService } from './Interfaces';

export class ConditionService<TState> implements IConditionService<TState> {

    private _equal: (valueA, valueB) => boolean = null;
    private _setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
    private _unwrapGroup = (rules: RuleAsync<TState>[], state: TState): Promise<boolean[]> => Promise.all(rules.map(rule => rule(state)));

    never = () => (state: TState) => Promise.resolve(false);

    always = () => (state: TState) => Promise.resolve(true);

    equals = (value: TState) => (state: TState) => Promise.resolve(deepEqual(value, state));

    all = (rules: RuleAsync<TState>[]) => (state: TState) =>
        this._unwrapGroup(rules, state)
            .then(ruleResults => ruleResults
                .reduce((last, current) => last && current, true)
            );

    and = this.all;

    some = (rules: RuleAsync<TState>[]) => (state: TState) =>
        this._unwrapGroup(rules, state)
            .then(ruleResults => ruleResults
                .filter(e => e).length > 0
            );

    any = this.some;

    or = this.some;

    not = (rule: RuleAsync<TState>) => (state: TState) =>
        rule(state)
            .then(result => !result);

    is = (rule: RuleSync<TState>) => (state: TState): Promise<boolean> => Promise.resolve(!!(rule(state)));

    sync = this.is;

    async = (ruleLike: RuleLikeAsync<TState> | RuleAsync<TState>) =>
        (state: TState) => ruleLike(state)
            .then(result => !!result)
            .catch(e => false)

    waitFor = this.async;

    timeout = ({ ms, $if, $when }: { ms: number, $if?: RuleLikeAsync<TState>, $when?: RuleLikeAsync<TState> }) => (state: TState) =>
        new Promise<boolean>((resolve, reject) => {

            const rule = $if || $when || this.never();

            let isResolve = false;

            const timerId = this._setTimeout(() => {
                // console.log('resolving from TIMEOUT');
                if (!isResolve) {
                    isResolve = true;
                    resolve(false);
                }
            }, ms);

            this.async(rule)(state)
                .then(result => {
                    if (!isResolve) {
                        //  console.log('resolving from PROMISE');
                        clearTimeout(timerId);
                        isResolve = true;
                        resolve(result);
                    }
                });

        });


    waitForOrSkip = this.timeout;

    has = (query: { [key: string]: Object }) => (state: TState) => {
        let result = true;
        Object.keys(query).forEach(key => {
            result = result && (Object.keys(state).indexOf(key) > -1) && this._equal(state[key], query[key]);
        });
        return Promise.resolve(result);
    };

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
