import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
import { GameUtils } from './game.utils';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private snake: Snake = [{ x: 0, y: 0 }];
  private food: Coordinates = { x: 1, y: 0 };
  private gridSize: GridSize = DEFAULT_GRID_SIZE;
  private speed = DEFAULT_SPEED;
  private direction: Direction = Direction.Right;
  private lastDirection: Direction = Direction.Right;
  private status = GameStatus.Initial;

  private lastTick = 0;

  private stateSource = new BehaviorSubject<GameState>({
    snake: this.snake,
    food: this.food,
    status: this.status,
  });

  private gridSizeSource = new BehaviorSubject<GridSize>(this.gridSize);

  public state$ = this.stateSource.asObservable();
  public gridSize$ = this.gridSizeSource.asObservable();

  constructor(private zone: NgZone) {}

  public setup(config?: GameConfig): void {
    this.gridSize = !!config?.gridSize ? config.gridSize : DEFAULT_GRID_SIZE;
    this.gridSizeSource.next(this.gridSize);

    this.snake = !!config?.snakeStart
      ? config.snakeStart
      : [this.randomCoordinates()];

    if (this.isOutsideOfBounds(this.snake[0])) {
      console.warn(
        'Provided snake position was outside of bounds, resetting to a random position.'
      );
      this.snake = [this.randomCoordinates()];
    }

    if (this.isOutsideOfBounds(this.snake[0])) {
      console.warn(
        'Provided snake position was outside of bounds, resetting to a random position.'
      );
      this.snake = [this.randomCoordinates()];
    }

    this.food = !!config?.foodStart
      ? config.foodStart
      : this.randomFoodCoordinates();

    if (this.isOutsideOfBounds(this.food)) {
      console.warn(
        'Provided food position was outside of bounds, resetting to a random position.'
      );
      this.food = this.randomFoodCoordinates();
    }

    this.speed = !!config?.initialSpeed ? config.initialSpeed : DEFAULT_SPEED;
    this.stateSource.next({
      snake: this.snake,
      food: this.food,
      status: this.status,
    });
  }

  public start(): void {
    this.status = GameStatus.Running;
    this.tick(0);
  }

  public setDirection(direction: Direction): void {
    if (this.snake.length > 1) {
      if (GameUtils.areDirectionsOpposite(direction, this.lastDirection)) {
        return;
      }
    }
    this.direction = direction;
  }

  public pause(): void {
    this.status = GameStatus.Paused;
    this.stateSource.next({
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
        this.direction
      );
      const newHead: Coordinates = {
        x: this.snake[0].x + directionCoordinates.x,
        y: this.snake[0].y + directionCoordinates.y,
      };

      this.lastDirection = this.direction;

      if (this.isOutsideOfBounds(newHead) || this.crashedIntoSelf(newHead)) {
        this.status = GameStatus.GameOver;
        this.zone.run(() => {
          this.stateSource.next({
            snake: this.snake,
            food: this.food,
            status: this.status,
          });
        });
        return;
      }

      const isEatingFood = GameUtils.arePointsEqual(newHead, this.food);

      if (isEatingFood) {
        this.snake.push(this.snake[this.snake.length - 1]);
      }
      this.snake.pop();
      this.snake.unshift(newHead);

      if (isEatingFood) {
        this.food = this.randomFoodCoordinates();
      }

      this.zone.run(() => {
        this.stateSource.next({
          snake: this.snake,
          food: this.food,
          status: this.status,
        });
      });
    });
  }

  private randomCoordinates(): Coordinates {
    return {
      x: Math.floor(Math.random() * (this.gridSize?.width ?? 0)),
      y: Math.floor(Math.random() * (this.gridSize?.height ?? 0)),
    };
  }

  private randomFoodCoordinates(): Coordinates {
    const randomCoordinates = this.randomCoordinates();
    return this.snake.some((segment) =>
      GameUtils.arePointsEqual(randomCoordinates, segment)
    )
      ? this.randomFoodCoordinates()
      : randomCoordinates;
  }

  private isOutsideOfBounds(position: Coordinates): boolean {
    return (
      position.x < 0 ||
      position.x >= (this.gridSize?.width ?? 0) ||
      position.y < 0 ||
      position.y >= (this.gridSize?.height ?? 0)
    );
  }

  private crashedIntoSelf(position: Coordinates): boolean {
    return this.snake.some((segment, index) => {
      return index !== 1 && GameUtils.arePointsEqual(segment, position);
    });
  }
}
