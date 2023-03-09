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

export type Snake = Coordinates[];

export enum GameStatus {
    Initial = 'initial',
    Running = 'running',
    Paused = 'paused',
    GameOver = 'game-over',
}

export type GameConfig = {
  gridSize?: GridSize;
  snakeStart?: Snake;
  foodStart?: Coordinates;
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
