export type GridSize = {
  width: number;
  height: number;
};

export const DEFAULT_GRID_SIZE: GridSize = {
  width: 10,
  height: 10,
};

export const DEFAULT_SPEED = 2;

export type Coordinates = {
  x: number;
  y: number;
};

export class Snake {
  public direction: Direction;
  public segments: Coordinates[];
  public get body(): Coordinates[] {
    return this.segments.slice(1, -1);
  }
  public get head(): Coordinates {
    return this.segments[0];
  }
  public get tail(): Coordinates | null {
    return this.segments.length > 1
      ? this.segments[this.segments.length - 1]
      : null;
  }
  public get tailDirection(): Direction | null {
    if (!this.tail) {
      return null;
    }
    const lastBodySegment = this.body[this.body.length - 1] ?? this.head;

    if (lastBodySegment.x - this.tail.x === 1) {
      return Direction.Right;
    } else if (lastBodySegment.x - this.tail.x === -1) {
      return Direction.Left;
    } else if (lastBodySegment.y - this.tail.y === 1) {
      return Direction.Down;
    } else if (lastBodySegment.y - this.tail.y === -1) {
      return Direction.Up;
    }
    return null;
  }

  public constructor(
    segments: Coordinates[],
    direction: Direction = DEFAULT_DIRECTION,
  ) {
    this.segments = segments;
    this.direction = direction;
  }
}

export enum GameStatus {
  Initial = 'initial',
  Running = 'running',
  Paused = 'paused',
  GameOver = 'game-over',
}

export type GameConfig = {
  gridSize?: GridSize;
  snake?: Snake;
  food?: Coordinates;
  initialSpeed?: number;
};

export type GameState = {
  snake: Snake;
  food: Coordinates;
  status: GameStatus;
};

export enum Direction {
  Left = '👈',
  Right = '👉',
  Up = '☝️',
  Down = '👇',
}

export const DEFAULT_DIRECTION = Direction.Right;
