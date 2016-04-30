import RuleEngine, { ConditionService, Condition, RuleSync, RuleAsync, IConditionConfig, RuleResult, RuleResultOf } from '../index';

interface IPlayer {
    name: string;
    health: number;
}
const { $if, $when } = new RuleEngine<IPlayer>();

// player conditions 
const player = {
    isAlive: ({ health }: IPlayer) => (health > 0),
    isDead: ({ health }: IPlayer) => (health === 0)
}
// player actions
const actions = {
    kill: (player: IPlayer) => ((player.health = 0), player),
    resurrect: (player: IPlayer) => ((player.health = 100), player),
    heal: (xp: number) => (player: IPlayer) => ((player.health = (xp < 100 ? xp : 100)), player),
    hit: (player: IPlayer) => ((player.health = player.health - 1), player),
}


function loop(state: IPlayer) {

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

const currentPlayer: IPlayer = { name: 'testplayer', health: 33 };
loop(currentPlayer)
    .catch(error => console.error(error));
