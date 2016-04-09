import * as assert from 'assert';
import * as should from 'should';
import { Helper } from '../Helper';

import { Condition, IState, IConditionConfig } from '../../lib/Condition';

interface ITestState {
    count: number;
}

describe('Rules', () => {
    const $if = new Condition<ITestState>();

    describe('always', () => {

        const { always } = $if;

        new Helper(always, null)
            .testConditionBase(null)
            .testRuleBase(null);

        it('Rule should always return true', (done) => {
            const config = { count: 0 };
            const state = { count: 999 };
            always(config)(state)
                .then(result => should(result).be.exactly(true))
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

            never(config)(state)
                .then(result => should(result).be.exactly(false))
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
                .then(result => should(result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('Rule should always return TRUE if state and config ARE Equal', (done) => {
            const config = { count: 999 };
            const state = { count: 999 };

            equals(config)(state)
                .then(result => should(result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('all', () => {

        const { all } = $if;

        new Helper(all, [])
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return FALSE if ONE of the rules evals to FALSE', (done) => {

            const $run = all([

                $if.always(),
                $if.never()

            ]);

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
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
                .then(result => should(result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return TURE if ALL of the rules eval to TURE', (done) => {

            const $run = all([

                $if.always(),
                $if.always()

            ]);

            $run({ count: 1 })
                .then(result => should(result).be.exactly(true))
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
                .then(result => should(result).be.exactly(true))
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
                .then(result => should(result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if ALL of the rules eval to FALSE', (done) => {

            const $run = some([

                $if.never(),
                $if.never(),

            ]);

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
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
                .then(result => should(result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if input rule evals to TRUE', (done) => {

            const $run = not(
                $if.always() // => true
            )

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

    });

    describe('is', () => {

        const { is } = $if;

        new Helper(is, $if.always())
            .testConditionBase(null)
            .testRuleBase(null);

        it('should return TRUE if input rule evals to TRUE', (done) => {

            const $run = is(
                () => true
            )

            $run({ count: 1 })
                .then(result => should(result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if input rule evals to FALSE', (done) => {

            const $run = is(
                () => false
            )

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
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
                .then(result => should(result).be.exactly(true))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if state HAS prop but prop has different value', (done) => {

            const $run = has({ count: 999 });

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
                .then(_ => done())
                .catch(done);
        });

        it('should return FALSE if state has not the prop passed', (done) => {
            const $run = has({ randomProp: 999 });

            $run({ count: 1 })
                .then(result => should(result).be.exactly(false))
                .then(_ => done())
                .catch(done);

        });

    });

});
