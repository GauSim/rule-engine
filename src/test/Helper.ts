
import * as should from 'should';
import { Condition, IConditionConfig } from '../lib/Interfaces';

export class Helper<T> {

    static truthyPromiseFunc = () => Promise.resolve({ some: 'value' });
    static falsyPromiseFunc = () => Promise.resolve(null);
    static errorPromiseFunc = () => Promise.reject(new Error('bla'));

    testConditionBase = () => {
        describe('Condition', () => {

            it('should be a function', () => should(this.condition).be.of.type('function'));
            it('should retun a rule (function)', () => should(this.condition(this.config)).be.of.type('function'));

        });

        return this;
    }

    testRuleBase = (state: T) => {

        describe('Rule', () => {

            it('should return a Promise', () => {

                const ruleResult = this.condition(this.config)(state);

                should(ruleResult).be.of.type('object');
                should(ruleResult).have.property('then');

            });
            describe('Result', () => {

                it('should be a RuleResult<TState>', (done) => {
                    this.condition(this.config)(state)
                        .then(result => {
                            should(result.$state).eql(state);
                            should(result.$result).be.of.type('boolean');
                        })
                        .then(_ => done())
                        .catch(done);
                });

            });
        });

        return this;
    }

    constructor(private condition: Condition<any>, private config: IConditionConfig) {

    }
}
