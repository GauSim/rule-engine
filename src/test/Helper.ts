
import * as should from 'should';
import { ICondition, IState, IConditionConfig } from '../lib/RuleEngine';

export class Helper {

    static truthyPromiseFunc = (state) => Promise.resolve({ some: 'value' });
    static falsyPromiseFunc = (state) => Promise.resolve(null);
    static errorPromiseFunc = (state) => Promise.reject(new Error('bla'));

    testConditionBase = (state: IState<any>) => {
        describe('Condition', () => {

            it('should be a function', () => should(this.condition).be.of.type('function'));
            it('should retun a rule (function)', () => should(this.condition(this.config)).be.of.type('function'));

        });

        return this;
    }

    testRuleBase = (state: IState<any>) => {

        describe('Rule', () => {

            it('should return a Promise', () => {

                const ruleResult = this.condition(this.config)(state);

                should(ruleResult).be.of.type('object');
                should(ruleResult).have.property('then');

            });
            describe('Result', () => {

                it('should be a boolean', (done) => {
                    this.condition(this.config)(state)
                        .then(result => should(result).be.of.type('boolean'))
                        .then(_ => done())
                        .catch(done);
                });

            });
        });

        return this;
    }

    constructor(private condition: ICondition<any>, private config: IConditionConfig) {

    }
}
