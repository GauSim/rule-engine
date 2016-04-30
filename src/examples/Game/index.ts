import { IGamePlayer } from './Interface/index';

import { GameLoop } from './GameLoop';
import { GameState } from './GameState';
import { GamePlayer } from './GamePlayer';
import RuleEngine, { ConditionService, Condition, RuleSync, RuleAsync, IConditionConfig, RuleResult, RuleResultOf } from '../../index';

const { $if, $when } = new RuleEngine<IGamePlayer>();

// player conditions 
const player = {
    isAlive: ({ health }: IGamePlayer) => (health > 0),
    isDead: ({ health }: IGamePlayer) => (health === 0)
}
// player actions
const actions = {
    kill: (player: IGamePlayer) => ((player.health = 0), player),
    resurrect: (player: IGamePlayer) => ((player.health = 100), player),
    heal: (xp: number) => (player: IGamePlayer) => ((player.health = (xp < 100 ? xp : 100)), player),
    hit: (player: IGamePlayer) => ((player.health = player.health - 1), player),
}




function loop(state: IGamePlayer) {

    return $if.combine
        ([
            $if.sync(player.isAlive)
                .modify(actions.hit), //.modify(actions.kill), .modify(actions.resurrect)

        ])

        (state)

        .then(result => {

            console.log('form', state);
            console.log('to', result.$state);

            return result.$result ? loop(result.$state) : null;
        })
}

const currentPlayer: IGamePlayer = { name: 'testplayer', health: 33 };
loop(currentPlayer)
    .catch(error => console.error(error));





/*
const state = new GameState();
state.addPlayer(new GamePlayer('Simon'))
new GameLoop(state).start();
*/
