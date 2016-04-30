

// attempt to pass state down, not jet used
export type RuleResultOf<TState extends {}> = IConditionService<TState> & {
    $state: TState;
    $result: boolean;
}

export type RuleResult<TState> = RuleResultOf<TState>;

export type RuleSync<TState> = (state?: TState) => RuleResult<TState>;
export type RuleLikeSync<TState> = (state?: TState) => RuleResult<TState>;
export type RuleAsync<TState> = (state: TState | RuleResultOf<TState>) => Promise<RuleResult<TState>>;
export type RuleLikeAsync<TState> = (state: TState | RuleResultOf<TState>) => Promise<any>;

export type Action<TState> = (transform: (e: TState) => TState) => RuleAsync<TState> | RuleAsyncWithName<TState>;

export type RuleAsyncWithName<TState> = RuleAsync<TState> & {
    modify: Action<TState>;
    thenModify: Action<TState>;
};

export type Condition<TState> = (conf?: IConditionConfig) => RuleAsync<TState> | RuleAsyncWithName<TState>;

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

