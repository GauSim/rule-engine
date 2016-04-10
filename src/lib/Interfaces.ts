

// attempt to pass state down
export type test_IConditionResult<T extends {}> = {
    $state: T;
    result: boolean;
}

export type RuleResult = boolean;
export type RuleSync<Tstate> = (state?: Tstate) => RuleResult;
export type RuleLikeSync<Tstate> = (state?: Tstate) => RuleResult;
export type RuleAsync<Tstate> = (state: Tstate) => Promise<RuleResult>;
export type RuleLikeAsync<Tstate> = (state: Tstate) => Promise<any>;
export type Condition<Tstate> = (conf?: IConditionConfig) => RuleAsync<Tstate>;

export interface IConditionConfig {
}

export interface IConditionService<TState> {
    never: Condition<TState>;
    always: Condition<TState>;
    equals: Condition<TState>;
    all: Condition<TState>;
    and: Condition<TState>;
    some: Condition<TState>;
    any: Condition<TState>;
    or: Condition<TState>;
    not: Condition<TState>;
    is: Condition<TState>;
    sync: Condition<TState>;
    async: Condition<TState>;
    waitFor: Condition<TState>;
    timeout: Condition<TState>;
    waitForOrSkip: Condition<TState>;
    has: Condition<TState>;
    propsAre: Condition<TState>;
}

