import * as _ from 'underscore';
import * as deepEqual from 'deep-equal';
import { condition, ruleAsync, ruleSync, ruleLikeSync, ruleLikeAsync } from './Interfaces';

export interface IConditions<T> {
    never: condition<T>;
    always: condition<T>;
    equals: condition<T>;
    all: condition<T>;
    and: condition<T>;
    some: condition<T>;
    any: condition<T>;
    or: condition<T>;
    not: condition<T>;
    is: condition<T>;
    sync: condition<T>;
    async: condition<T>;
    waitFor: condition<T>;
    timeout: condition<T>;
    waitForOrSkip: condition<T>;
    has: condition<T>;
    propsAre: condition<T>;
}

export class Conditions<Tstate> implements IConditions<Tstate> {

    private _equal: (valueA, valueB) => boolean = null;
    private _setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
    private _unwrapGroup = (rules: ruleAsync<Tstate>[], state: Tstate): Promise<boolean[]> => Promise.all(rules.map(rule => rule(state)));

    never = () => (state: Tstate) => Promise.resolve(false);

    always = () => (state: Tstate) => Promise.resolve(true);

    equals = (value: Tstate) => (state: Tstate) => Promise.resolve(deepEqual(value, state));

    all = (rules: ruleAsync<Tstate>[]) => (state: Tstate) =>
        this._unwrapGroup(rules, state)
            .then(ruleResults => ruleResults
                .reduce((last, current) => last && current, true)
            );

    and = this.all;

    some = (rules: ruleAsync<Tstate>[]) => (state: Tstate) =>
        this._unwrapGroup(rules, state)
            .then(ruleResults => ruleResults
                .filter(e => e).length > 0
            );

    any = this.some;

    or = this.some;

    not = (rule: ruleAsync<Tstate>) => (state: Tstate) =>
        rule(state)
            .then(result => !result);

    is = (rule: ruleSync<Tstate>) => (state: Tstate): Promise<boolean> => Promise.resolve(!!(rule(state)));

    sync = this.is;

    async = (ruleLike: ruleLikeAsync<Tstate> | ruleAsync<Tstate>) =>
        (state: Tstate) => ruleLike(state)
            .then(result => !!result)
            .catch(e => false)

    waitFor = this.async;

    timeout = ({ ms, $if, $when }: { ms: number, $if?: ruleLikeAsync<Tstate>, $when?: ruleLikeAsync<Tstate> }) => (state: Tstate) =>
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

    has = (query: { [key: string]: Object }) => (state: Tstate) => {
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
    $if = new Conditions<T>();
    $when = this.$if;
}
