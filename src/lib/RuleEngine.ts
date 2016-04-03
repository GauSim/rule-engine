import { Condition } from './Condition';

export default class RuleEngine<T> {
    $if = new Condition<T>();
    $when = this.$if;
}
