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


/*
const _requestAnimFrame = function (callback) {

    return window.requestAnimationFrame ||
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        window['oRequestAnimationFrame'] ||
        window.msRequestAnimationFrame ||
        (callback => window.setTimeout(callback, 1000 / 60))
};

function drawRect(myRectangle, context) {
    context.beginPath();
    context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
    context.fillStyle = '#8ED6FF';
    context.fill();
    context.lineWidth = myRectangle.borderWidth;
    context.strokeStyle = 'black';
    context.stroke();
}

function animate(lastTime, myRectangle, runAnimation, canvas, context) {
    if (runAnimation.value) {
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;

        // pixels / second
        var linearSpeed = 100;
        var linearDistEachFrame = linearSpeed * timeDiff / 1000;
        var currentX = myRectangle.x;

        if (currentX < canvas.width - myRectangle.width - myRectangle.borderWidth / 2) {
            var newX = currentX + linearDistEachFrame;
            myRectangle.x = newX;
        }

        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw
        drawRect(myRectangle, context);

        // request new frame
        _requestAnimFrame(function () {
            animate(time, myRectangle, runAnimation, canvas, context);
        });
    }
}


var canvas: HTMLCanvasElement = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var myRectangle = {
    x: 0,
    y: 75,
    width: 100,
    height: 50,
    borderWidth: 5
};


*/