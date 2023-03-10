import { Coordinates } from '../game.model';

export type Tile = {
  coordinates: Coordinates;
  hasSnakeBody: boolean;
  hasSnakeHead: boolean;
  hasFood: boolean;
};
