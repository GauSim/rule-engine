

// attempt to pass state down
export type test_IConditionResult<T extends {}> = {
    $state: T;
    result: boolean;
}

export type IConditionResult = boolean;

export type ruleSync<Tstate> = (state?: Tstate) => boolean;
export type ruleLikeSync<Tstate> = (state?: Tstate) => boolean;
export type ruleAsync<Tstate> = (state: Tstate) => Promise<boolean>;
export type ruleLikeAsync<Tstate> = (state: Tstate) => Promise<any>;
export type condition<Tstate> = (conf?: any) => ruleAsync<Tstate>;

// export type condition<Tstate, Tconfig> = (conf?: Tconfig) => ruleAsync<Tstate>;


// config?: IConditionConfig
export interface IConditionConfig {
}


