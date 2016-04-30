import { IGamePlayer } from './Interface/index';

import * as Immutable from 'immutable';

console.log(Immutable);



export class GameState {
    private startTime: number;
    private endTime: number;

    public players: Immutable.Map<string, IGamePlayer> = Immutable.Map({}); // { [playerId: string]: IGamePlayer } = {};

    constructor() {
        this.startTime = Date.now()
        this.endTime = this.startTime + 500;
    }

    private createPlayerId(idLength: number = 15) {
        const chars = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
        let unique_id = "";
        for (var i = 0; i < idLength; i++) {
            unique_id += chars[Math.floor(Math.random() * ((chars.length - 1) - 0 + 1) + 0)];
        }
        return unique_id;
    }

    getRemaningGameTime() {
        return this.endTime - Date.now();
    }

    addPlayer(player: IGamePlayer) {
        this.players = this.players.set(this.createPlayerId(), player);
    }

}
