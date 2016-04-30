import * as assert from 'assert';
import * as should from 'should';
import * as _ from 'underscore';
import { Helper } from '../Helper';
import { RuleResultOf } from '../../lib/Interfaces';
import { RuleEngine, ConditionService } from '../../lib/RuleEngine';

interface ITestState {
    count: number;
}

describe('Module', () => {
    it('should have $if and $when', () => {

        const { $if, $when } = new RuleEngine<{ random: 'state' }>();

        should($if).be.ok();
        should($if).be.instanceof(ConditionService);

        should($when).be.ok();
        should($when).be.instanceof(ConditionService);
    });
});

describe('Rules', () => {
    const $if = new ConditionService<ITestState>();

    describe('toResult', () => {
        it('should state and true into result', () => {
            const state = { count: 1 };

            const result = $if.toResult(state, true);
            should(result.$state).eql(state);
            should(result.$result).true();
        });

        it('should state and false into result', () => {
            const state = { count: 1 };

            const result = $if.toResult(state, false);
            should(result.$state).eql(state);
            should(result.$result).false();
        });

        it('should result and false into result', () => {
            const RuleResult: RuleResultOf<ITestState> = <any>{ $state: { count: 1 }, $result: false };

            const result = $if.toResult(RuleResult, true);
            should(result.$state).eql(RuleResult.$state);
            should(result.$result).true();
        });

        it('should result and false into result', () => {
            const RuleResult: RuleResultOf<ITestState> = <any>{ $state: { count: 1 }, $result: false };

            const result = $if.toResult(RuleResult, false);
            should(result.$state).eql(RuleResult.$state);
            should(result.$result).false();
        });
    });

    describe('toState', () => {
        it('should state and true into result', () => {
            const input_state = { count: 1 };

            const state = $if.toState(input_state);
            should(state).eql(input_state);
        });

        it('should result and false into result', () => {
            const RuleResult: RuleResultOf<ITestState> = <any>{ $state: { count: 1 }, $result: false };

            const state = $if.toState(RuleResult);
            should(state).eql(RuleResult.$state);
        });
    });

    describe('always', () => {

        const { always } = $if;

        new Helper(always, null)
            .testConditionBase(null)
            .testRuleBase(null);

        it('Rule should always return true', (done) => {
            const config = { count: 0 };
            const state = { count: 999 };
            always()(state)
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('never', () => {

        const { never } = $if;

        new Helper(never, null)
            .testConditionBase(null)
            .testRuleBase(null);

        it('Rule should always return false', (done) => {
            const config = { count: 0 };
            const state = { count: 999 };

            never()(state)
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('equals', () => {

        const { equals } = $if;

        new Helper(equals, null)
            .testConditionBase(null)
            .testRuleBase(null);

        it('Rule should always return FALSE if state and config ARE NOT Equal', (done) => {
            const config = { count: 0 };
            const state = { count: 999 };

            equals(config)(state)
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('Rule should always return TRUE if state and config ARE Equal', (done) => {
            const config = { count: 999 };
            const state = { count: 999 };

            equals(config)(state)
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('all', () => {

        const { all } = $if;

        new Helper(all, [ $if.always() ])
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return FALSE if ONE of the rules evals to FALSE', (done) => {

            const $run = all([

                $if.always(),
                $if.never()

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if ONE of the rules evals to FALSE', (done) => {

            const $run = all([

                $if.always(),
                $if.never(),
                $if.always()

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return TURE if ALL of the rules eval to TURE', (done) => {

            const $run = all([

                $if.always(),
                $if.always()

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('some', () => {

        const { some } = $if;

        new Helper(some, [])
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if ONE of the rules evals to TRUE', (done) => {

            const $run = some([

                $if.never(),
                $if.always()

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return TRUE if MORE THEN ONE of the rules evals to TRUE', (done) => {

            const $run = some([

                $if.always(),
                $if.never(),
                $if.always()

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if ALL of the rules eval to FALSE', (done) => {

            const $run = some([

                $if.never(),
                $if.never(),

            ]);

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });
    });

    describe('not', () => {

        const { not } = $if;

        new Helper(not, $if.never())
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if input rule evals to FALSE', (done) => {

            const $run = not(
                $if.never() // => false
            )

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if input rule evals to TRUE', (done) => {

            const $run = not(
                $if.always() // => true
            )

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('is', () => {

        const { is } = $if;

        new Helper(is, () => true)
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if input rule evals to TRUE', (done) => {

            const $run = is(
                () => true
            )

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if input rule evals to FALSE', (done) => {

            const $run = is(
                () => false
            )

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('has', () => {

        const { has } = $if;

        new Helper(has, {})
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if state HAS prop with the passd value', (done) => {

            const $run = has({ count: 1 });

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if state HAS prop but prop has different value', (done) => {

            const $run = has({ count: 999 });

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if state has not the prop passed', (done) => {
            const $run = has({ randomProp: 999 });

            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);

        });

    });

    describe('async', () => {
        const { async } = $if;

        new Helper(async, $if.always())
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if promise result is truthy', (done) => {
            const $run = async(Helper.truthyPromiseFunc);
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if promise result is falsy', (done) => {
            const $run = async(Helper.falsyPromiseFunc);
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if promise is rejected', (done) => {
            const $run = async(Helper.errorPromiseFunc);
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('timeout', () => {

        const { timeout } = $if;

        new Helper($if.timeout, { ms: 100, $if: $if.always() })
            .testConditionBase(null)
            .testRuleBase(null);

        it('should call timeout', (done) => {
            let was_called = false;
            const _setTimeout = (func: () => any, t: number) => {
                was_called = true;
                func();
            };

            const _$if = new ConditionService({ _setTimeout });


            const $run = _$if.timeout({ ms: 0, $if: Helper.truthyPromiseFunc });
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => should(was_called).be.exactly(true))
                .then(_ => done())
                .catch(done);

        });
        it('should return TRUE promise is truthy )', (done) => {

            const $run = timeout({ ms: 0, $if: Helper.truthyPromiseFunc });
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(true))
                .then(_ => done())
                .catch(done);

        });

        it('should return FALSE promise is falsy )', (done) => {

            const $run = timeout({ ms: 0, $if: Helper.falsyPromiseFunc });
            $run({ count: 1 })
                .then(result => should(result.$result).be.exactly(false))
                .then(_ => done())
                .catch(done);

        });

    });
});
