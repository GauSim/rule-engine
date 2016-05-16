import { IGamePlayer, IPosition } from './Interface/index';

export class GamePlayer implements IGamePlayer {
    name: string;
    health: number;
    position: IPosition;

    constructor(name: string, pos: IPosition = { x: 0, y: 0, width: 50, height: 50 }) {
        this.name = name;
        this.health = 100;
        this.position = pos;
    }
}
