import { IGamePlayer } from './Interface/index';

export class GamePlayer implements IGamePlayer {
    name: string;
    health: number;
    constructor(name: string) {
        this.name = name;
        this.health = 100;
    }
}
