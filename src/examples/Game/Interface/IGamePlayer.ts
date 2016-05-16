import { IPosition } from './IPosition';

export interface IGamePlayer {
    name: string;
    health: number;
    position: IPosition;
}