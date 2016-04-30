import {GameState} from './GameState';
export class GameLoop {
    private intervallID: NodeJS.Timer;
    private state: GameState;
    constructor(state: GameState) {
        this.state = state;

    }
    start(_state?: GameState) {
        this.state = _state ? _state : this.state;
        this.intervallID = setInterval(() => {
            if (this.state.getRemaningGameTime() > 0) {
                this.run();
            } else {
                this.exit();
            }
        }, 0)
    }
    run() {
        // console.log('game running', this.state.getRemaningGameTime());
        console.log(this.state.players);
    }
    exit() {
        console.log('exit game');
        clearInterval(this.intervallID);
    }

}
