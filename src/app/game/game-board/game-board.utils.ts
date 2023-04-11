import { Coordinates, Snake } from '../game.model';
import { GameUtils } from '../game.utils';
import { Tile } from './game-board.model';

function coordinatesHaveSnakeBody(tile: Coordinates, snake?: Snake | null) {
  return (
    !!snake &&
    snake.body.some((segment) => GameUtils.arePointsEqual(segment, tile))
  );
}

function getPointFromIndex(index: number, width: number): Coordinates {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
}

export function computeTiles(
  width: number,
  height: number,
  snake: Snake,
  food: Coordinates,
): Tile[] {
  return [...Array(width * height).keys()].map((i) => {
    const coordinates = getPointFromIndex(i, width);
    const hasSnakeBody = coordinatesHaveSnakeBody(coordinates, snake);
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

export function constructTwitterShareUrl(score: number): string {
  const text = `I scored ${score} on the Angular + TensorFlow.js demo snake game! Try it out https://goo.gle/angular-tf-snake #io23`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
