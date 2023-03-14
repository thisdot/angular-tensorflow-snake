import { Coordinates } from '../game.model';

export type Tile = {
  coordinates: Coordinates;
  hasSnakeBody: boolean;
  hasSnakeHead: boolean;
  hasSnakeTail: boolean;
  rotation?: `${number}deg` | null;
  hasFood: boolean;
};
