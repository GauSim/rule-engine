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
    (config: IConditionConfig): IRuleAsync<T>;
}

export class Condition<T> {

    private _equal: (valueA, valueB) => boolean = null;
    private _unwrapGroup = (rules: IRuleAsync<T>[], state: IState<T>): Promise<boolean[]> => Promise.all(rules.map(rule => rule(state)));

    never = (config: IConditionConfig = null): IRuleAsync<T> =>
        (state: IState<T> = null) =>
            Promise.resolve(false);

    always = (config: IConditionConfig = null): IRuleAsync<T> =>
        (state: IState<T> = null) =>
            Promise.resolve(true);

    equals = (value: IState<T>): IRuleAsync<T> =>
        (state: IState<T>) => Promise.resolve(deepEqual(value, state));

    all = (rules: IRuleAsync<T>[]): IRuleAsync<T> =>
        (state: IState<T>) =>
            this._unwrapGroup(rules, state)
                .then(ruleResults => ruleResults
                    .reduce((last, current) => last && current, true)
                );

    and = this.all;
    some = (rules: IRuleAsync<T>[]): IRuleAsync<T> =>
        (state: IState<T>) =>
            this._unwrapGroup(rules, state)
                .then(ruleResults => ruleResults
                    .filter(e => e).length > 0
                );

    any = this.some;
    or = this.some;
    not = (rule: IRuleAsync<T>): IRuleAsync<T> =>
        (state: IState<T>) =>
            rule(state)
                .then(result => !result);

    is = (rule: IRule<T>): IRuleAsync<T> =>
        (state: IState<T>) =>
            Promise.resolve(!!(rule(state)));

    sync = this.is;
    // TODO: needs test
    async = (ruleLike: (state: IState<T>) => Promise<any>): IRuleAsync<T> =>
        (state: IState<T>) => ruleLike(state)
            .then(result => !!result) // cast to boolean!


    waitFor = this.async;
    // TODO: needs test
    waitForOrSkip = (ms: number, rule: IRuleAsync<T>): IRuleAsync<T> =>
        (state: IState<T>) =>
            new Promise<boolean>((resolve, reject) => {

                let isResolve = false;

                const done = _.once((result: boolean) => {
                    if (!isResolve) {
                        isResolve = true;
                        resolve(result);
                    }
                });

                const timerId = setTimeout(() => {
                    console.log('resolving from TIMEOUT');
                    done(false);
                }, ms);

                this.waitFor(rule)(state)
                    .then(result => {
                        if (!isResolve) {
                            console.log('resolving from PROMISE');
                            clearTimeout(timerId);
                            done(result);
                        }
                    });
            });


    timeout = this.waitForOrSkip;
    has = (query: { [key: string]: Object }): IRuleAsync<T> =>
        (state: IState<T>) => {
            let result = true;
            Object.keys(query).forEach(key => {
                result = result && (Object.keys(state).indexOf(key) > -1) && this._equal(state[key], query[key]);
            });
            return Promise.resolve(result);
        };

    propsAre = this.has;

    constructor() {
        this._equal = deepEqual;
    }
}
