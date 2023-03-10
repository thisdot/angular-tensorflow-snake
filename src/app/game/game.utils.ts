import { Coordinates, Direction } from './game.model';

export class GameUtils {
  public static arePointsEqual(
    point1?: Coordinates | null,
    point2?: Coordinates | null
  ): boolean {
    return (
      !!point1 && !!point2 && point1.x === point2.x && point1.y === point2.y
    );
  }

  public static directionToCoordinates(direction: Direction): Coordinates {
    switch (direction) {
      case Direction.Up:
        return { x: 0, y: -1 };
      case Direction.Down:
        return { x: 0, y: 1 };
      case Direction.Left:
        return { x: -1, y: 0 };
      case Direction.Right:
        return { x: 1, y: 0 };
    }
  }

  public static areDirectionsOpposite(
    direction1: Direction,
    direction2: Direction
  ): boolean {
    return (
      (direction1 === Direction.Up && direction2 === Direction.Down) ||
      (direction1 === Direction.Down && direction2 === Direction.Up) ||
      (direction1 === Direction.Left && direction2 === Direction.Right) ||
      (direction1 === Direction.Right && direction2 === Direction.Left)
    );
  }
}
