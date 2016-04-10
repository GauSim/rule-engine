import { RuleEngine, Conditions } from './lib/RuleEngine';
import { condition, ruleSync, ruleAsync, IConditionConfig, IConditionResult } from './lib/Interfaces';

export default RuleEngine;
export { Conditions, condition, ruleSync, ruleAsync, IConditionConfig, IConditionResult };