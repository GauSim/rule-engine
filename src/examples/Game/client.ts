import { IGamePlayer } from './Interface/index';

import { GameLoop } from './GameLoop';
import { GameState } from './GameState';
import { GamePlayer } from './GamePlayer';

const state = new GameState();


for (var n = 0; n < 59; n++) {
    state.addPlayer(
        new GamePlayer('Simon' + n, { x: n * 50, y: n * 50, width: 50, height: 50 })
    )

}

const canvas = <HTMLCanvasElement>document.getElementById('world');
const game = new GameLoop(canvas);

game.start(state);
