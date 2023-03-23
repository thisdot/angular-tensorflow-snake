import { Direction, GameConfig } from './game.model';

export interface GameService {
  setup(config?: GameConfig): void;

  start(): void;

  setDirection(direction: Direction): void;

  pause(): void;
}
