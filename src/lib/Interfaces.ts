

// attempt to pass state down, not jet used
export type StateOf<TState extends {}> = {
    $if: IConditionService<TState>
    $state: TState;
    result: boolean;
}

export type RuleResult<TState> = boolean;
//export type RuleResult<TState> = StateOf<TState>;
export type RuleSync<TState> = (state?: TState) => RuleResult<TState>;
export type RuleLikeSync<TState> = (state?: TState) => RuleResult<TState>;
export type RuleAsync<TState> = (state: TState) => Promise<RuleResult<TState>>;
export type RuleLikeAsync<TState> = (state: TState) => Promise<any>;
export type Condition<TState> = (conf?: IConditionConfig) => RuleAsync<TState>;

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

