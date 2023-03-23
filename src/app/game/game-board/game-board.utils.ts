import { Coordinates, Snake } from '../game.model';
import { GameUtils } from '../game.utils';
import { Tile } from './game-board.model';

export class GameBoardUtils {
  private static hasSnakeBody(tile: Coordinates, snake?: Snake | null) {
    return (
      !!snake &&
      snake.body.some((segment) => GameUtils.arePointsEqual(segment, tile))
    );
  }

  private static getPointFromIndex(index: number, width: number): Coordinates {
    return {
      x: index % width,
      y: Math.floor(index / width),
    };
  }

  public static computeTiles(
    width: number,
    height: number,
    snake: Snake,
    food: Coordinates,
  ): Tile[] {
    return [...Array(width * height).keys()].map((i) => {
      const coordinates = this.getPointFromIndex(i, width);
      const hasSnakeBody = this.hasSnakeBody(coordinates, snake);
      const hasSnakeHead = GameUtils.arePointsEqual(coordinates, snake?.head);
      const hasSnakeTail = GameUtils.arePointsEqual(coordinates, snake?.tail);
      const rotation = hasSnakeHead
        ? GameUtils.rotationFromDirection(snake?.direction)
        : hasSnakeTail && snake?.tailDirection
        ? GameUtils.rotationFromDirection(snake.tailDirection)
        : null;
      const hasFood = GameUtils.arePointsEqual(coordinates, food);
      return {
        coordinates,
        hasSnakeBody,
        hasSnakeHead,
        hasSnakeTail,
        hasFood,
        rotation,
      };
    });
  }
}
