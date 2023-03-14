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
    return this.segments.slice(1);
  }
  public get head(): Coordinates {
    return this.segments[0];
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
