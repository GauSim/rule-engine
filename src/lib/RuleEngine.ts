import * as _ from 'underscore';
import * as deepEqual from 'deep-equal';

// attempt to pass state down
export type IConditionResult<T extends {}> = {
    $state: T;
    result: boolean;
}

export type IState<T extends {}> = T & {
};

export interface IRule<T> {
    (state?: IState<T>): boolean;
}
export interface IRuleAsync<T> {
    (state: IState<T>): Promise<boolean>;
}

export interface IRuleAsync<T> {
    (state: IState<T>): Promise<boolean>;
}

export interface IConditionConfig {
}

export interface ICondition<T> {
    (config?: IConditionConfig): IRuleAsync<T>;
}

export class Condition<T> {

    private _equal: (valueA, valueB) => boolean = null;
    private _setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => number;
    private _unwrapGroup = (rules: IRuleAsync<T>[], state: IState<T>): Promise<boolean[]> => Promise.all(rules.map(rule => rule(state)));

    never: ICondition<T> = (): IRuleAsync<T> =>
        (state: IState<T>) =>
            Promise.resolve(false);

    always: ICondition<T> = (): IRuleAsync<T> =>
        (state: IState<T>) =>
            Promise.resolve(true);

    equals: ICondition<T> = (value: IState<T>): IRuleAsync<T> =>
        (state: IState<T>) => Promise.resolve(deepEqual(value, state));

    all: ICondition<T> = (rules: IRuleAsync<T>[]): IRuleAsync<T> =>
        (state: IState<T>) =>
            this._unwrapGroup(rules, state)
                .then(ruleResults => ruleResults
                    .reduce((last, current) => last && current, true)
                );

    and: ICondition<T> = this.all;
    some: ICondition<T> = (rules: IRuleAsync<T>[]): IRuleAsync<T> =>
        (state: IState<T>) =>
            this._unwrapGroup(rules, state)
                .then(ruleResults => ruleResults
                    .filter(e => e).length > 0
                );

    any: ICondition<T> = this.some;
    or: ICondition<T> = this.some;
    not: ICondition<T> = (rule: IRuleAsync<T>): IRuleAsync<T> =>
        (state: IState<T>) =>
            rule(state)
                .then(result => !result);

    is: ICondition<T> = (rule: IRule<T>): IRuleAsync<T> =>
        (state: IState<T>) =>
            Promise.resolve(!!(rule(state)));

    sync: ICondition<T> = this.is;

    async: ICondition<T> = (ruleLike: (state: IState<T>) => Promise<any>): IRuleAsync<T> =>
        (state: IState<T>) => ruleLike(state)
            .then(result => !!result)
            .catch(e => false)

    waitFor: ICondition<T> = this.async;

    timeout: ICondition<T> = ({ ms, $if, $when }: { ms: number, $if?: IRuleAsync<T>, $when?: IRuleAsync<T> }): IRuleAsync<T> =>
        (state: IState<T>) =>
            new Promise<boolean>((resolve, reject) => {

                const rule = $if || $when || this.never;

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


    waitForOrSkip: ICondition<T> = this.timeout;

    has: ICondition<T> = (query: { [key: string]: Object }): IRuleAsync<T> =>
        (state: IState<T>) => {
            let result = true;
            Object.keys(query).forEach(key => {
                result = result && (Object.keys(state).indexOf(key) > -1) && this._equal(state[key], query[key]);
            });
            return Promise.resolve(result);
        };

    propsAre: ICondition<T> = this.has;

    constructor(owerwrites: any = {}) {
        this._setTimeout = owerwrites._setTimeout || setTimeout;
        this._equal = owerwrites._equal || deepEqual;
    }
}

export default class RuleEngine<T> {
    $if = new Condition<T>();
    $when = this.$if;
}
