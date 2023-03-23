import { Injectable, NgZone, signal } from '@angular/core';
import {
  Coordinates,
  DEFAULT_GRID_SIZE,
  DEFAULT_SPEED,
  Direction,
  GameConfig,
  GameState,
  GameStatus,
  GridSize,
  Snake,
} from './game.model';
import { GameServiceBase } from './game.service.base';
import { GameService } from './game.service.model';
import { GameUtils } from './game.utils';

@Injectable()
export class SignalsGameService extends GameServiceBase implements GameService {
  public state = signal<GameState>({
    snake: this.snake,
    food: this.food,
    status: this.status,
  });

  public gridSize = signal<GridSize>(this.gridSizeInternal);

  public constructor(private zone: NgZone) {
    super();
  }

  public override setup(config?: GameConfig): void {
    this.gridSizeInternal = config?.gridSize
      ? config.gridSize
      : DEFAULT_GRID_SIZE;

    this.gridSize.set(this.gridSizeInternal);

    this.snake = config?.snake
      ? config.snake
      : new Snake([this.randomCoordinates()]);

    if (this.isOutsideOfBounds(this.snake.segments)) {
      console.warn(
        'Provided snake position was outside of bounds, resetting to a random position.',
      );
      this.snake.segments = [this.randomCoordinates()];
    }

    this.food = config?.food ? config.food : this.randomFoodCoordinates();

    if (
      this.isPointOutsideOfBounds(this.food) ||
      this.isPointOnSnake(this.food)
    ) {
      console.warn(
        'Provided food position was outside of bounds or on a snake, resetting to a random position.',
      );
      this.food = this.randomFoodCoordinates();
    }

    this.speed = config?.initialSpeed ? config.initialSpeed : DEFAULT_SPEED;

    this.status = GameStatus.Initial;

    this.state.set({
      snake: this.snake,
      food: this.food,
      status: this.status,
    });
  }

  public override start(): void {
    this.status = GameStatus.Running;
    this.tick(0);
  }

  public override setDirection(direction: Direction): void {
    if (this.snake.tail) {
      if (GameUtils.areDirectionsOpposite(direction, this.snake.direction)) {
        return;
      }
    }
    this.direction = direction;
  }

  public override pause(): void {
    this.status = GameStatus.Paused;
    this.state.set({
      snake: this.snake,
      food: this.food,
      status: this.status,
    });
  }

  private tick(timestamp: number): void {
    if (this.status !== GameStatus.Running) {
      return;
    }
    if (timestamp - this.lastTick >= 1000 / this.speed) {
      this.lastTick = timestamp;
      this.moveSnake();
    }
    requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  private moveSnake(): void {
    this.zone.runOutsideAngular(() => {
      const directionCoordinates = GameUtils.directionToCoordinates(
        this.direction,
      );
      const newHead: Coordinates = {
        x: this.snake.head.x + directionCoordinates.x,
        y: this.snake.head.y + directionCoordinates.y,
      };

      this.snake.direction = this.direction;

      if (
        this.isPointOutsideOfBounds(newHead) ||
        this.isPointOnSnake(newHead)
      ) {
        this.status = GameStatus.GameOver;
        this.state.set({
          snake: this.snake,
          food: this.food,
          status: this.status,
        });
        return;
      }

      const isEatingFood = GameUtils.arePointsEqual(newHead, this.food);

      if (isEatingFood) {
        this.snake.segments.push(
          this.snake.segments[this.snake.segments.length - 1],
        );
      }
      this.snake.segments.pop();
      this.snake.segments.unshift(newHead);

      if (isEatingFood) {
        this.food = this.randomFoodCoordinates();
      }

      this.state.set({
        snake: this.snake,
        food: this.food,
        status: this.status,
      });
    });
  }
}
