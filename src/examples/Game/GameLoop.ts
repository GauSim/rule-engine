import { IPosition, IGamePlayer } from './Interface/index';
import { GameState } from './GameState';

export class GameLoop {
    renderingEngine: RenderingEngine = null;
    state: GameState = null;

    runLoop = (state: GameState) => {

        this.state = state;

        this.state.players.forEach(p => {

            const r1 = Math.floor((Math.random() * 10) + 1) < 5;
            const r2 = Math.floor((Math.random() * 10) + 1) < 5;

            p.position.x += r1 ? 1 : -1;
            p.position.y += r2 ? 1 : 1;

            if (p.position.x >= this.renderingEngine.width) p.position.x = 0;
            if (p.position.x < 0) p.position.x = this.renderingEngine.width - p.position.width;

            if (p.position.y >= this.renderingEngine.height) p.position.y = 0;
            if (p.position.y < 0) p.position.y = this.renderingEngine.height - p.position.height;

        })

        // console.log('ok', state.getRemaningGameTime() > 0);

        this.renderingEngine.draw(state);

        if (state.getRemaningGameTime() < 0) {
            return void (0);
        } else {
            return window.requestAnimationFrame(e => this.runLoop(state));
        }
    }

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        this.renderingEngine = new RenderingEngine(context, canvas.width, canvas.height);

        canvas.addEventListener('click', (e) => {

            console.log('click: ' + e.offsetX + '/' + e.offsetY);
            console.log(this.state);

            this.state.players.forEach(player => {
                if (e.offsetX <= (player.position.width + player.position.x)
                    && e.offsetX >= (player.position.x)
                    && e.offsetY <= (player.position.height + player.position.y)
                    && e.offsetY >= (player.position.y)
                ) {
                    player.health -= 1;
                }
            })

        }, false);

    }

    start(state: GameState) {
        this.runLoop(state);
    }

}


let test = 0;
export class RenderingEngine {

    constructor(
        private context: CanvasRenderingContext2D,
        public width: number,
        public height: number) {
    }


    draw(state: GameState) {
        this.context.clearRect(0, 0, this.width, this.height);


        state.players.forEach(p => this.drawPlayer(p));




        this.drawTimer(state.getRemaningGameTime());
    }

    drawPlayer(player: IGamePlayer) {

        this.context.beginPath();
        this.context.rect(player.position.x, player.position.y, player.position.width, player.position.height);


        if (player.health > 75) {
            this.context.fillStyle = 'green';
        } else if (player.health > 50 && player.health < 75) {
            this.context.fillStyle = 'yellow';
        } else {
            this.context.fillStyle = 'red';
        }

        this.context.fill();
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'black';
        this.context.stroke();

        this.context.font = '12pt Calibri';
        this.context.fillStyle = 'white';

        //this.context.fillText(`${player.name}`, player.position.x, player.position.y + 10);
        this.context.fillText(`${player.health}`, player.position.x, player.position.y + 20);
        //this.context.fillText(`x:${player.position.x}, y:${player.position.y}`, player.position.x, player.position.y + 30);

    }
    drawTimer(time: number) {
        this.context.font = '12pt Calibri';
        this.context.fillStyle = 'black';
        this.context.fillText(time.toString(), (this.width - 100), 20);
    }
}



