import { TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs';
import { Snake, DEFAULT_DIRECTION, GameStatus, Direction } from './game.model';

import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup the game with default values', (done) => {
    service.setup();
    service.state$.subscribe((val) => {
      expect(val.snake.head).toBeDefined();
      expect(val.snake.body.length).toBe(0);
      expect(val.snake.direction).toBe(DEFAULT_DIRECTION);
      expect(val.food).toBeDefined();
      expect(val.status).toBe(GameStatus.Initial);
      done();
    });
  });

  it('should setup the game with provided values', (done) => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
      food: { x: 2, y: 2 },
      initialSpeed: 3,
    });

    expect(service['speed']).toBe(3);

    service.state$.subscribe((val) => {
      expect(val).toEqual({
        snake: new Snake([
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ]),
        food: { x: 2, y: 2 },
        status: GameStatus.Initial,
      });
      done();
    });
  });

  it('should reposition food when it is on top of the snake', (done) => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
      food: { x: 2, y: 1 },
    });

    service.state$.subscribe(({ food }) => {
      expect(food).not.toBe({ x: 2, y: 1 });
      expect(service['isPointOnSnake'](food)).toBe(false);
      done();
    });
  });

  it('should start game', (done) => {
    service.state$.pipe(skip(1), take(1)).subscribe(({ status }) => {
      expect(status).toBe(GameStatus.Running);
      done();
    });

    service.start();
  });

  it('should pause game', (done) => {
    service.state$.pipe(skip(1), take(1)).subscribe(({ status }) => {
      expect(status).toBe(GameStatus.Paused);
      done();
    });
    service.pause();
  });

  it('should move the snake', (done) => {
    service.setup({
      snake: new Snake([
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ]),
    });

    service.state$.pipe(skip(1), take(1)).subscribe(({ snake }) => {
      expect(snake.head).toEqual({ x: 3, y: 1 });
      expect(snake.body).toEqual([{ x: 2, y: 1 }]);
      expect(snake.tail).toEqual({ x: 1, y: 1 });
      done();
    });

    service['moveSnake']();
  });

  it('should move the snake in the correct direction', (done) => {
    service.setup({
      snake: new Snake(
        [
          { x: 2, y: 1 },
          { x: 1, y: 1 },
        ],
        Direction.Down,
      ),
      food: { x: 5, y: 5 },
    });
    service.setDirection(Direction.Down);

    service.state$.pipe(skip(1), take(1)).subscribe(({ snake }) => {
      expect(snake.head).toEqual({ x: 2, y: 2 });
      expect(snake.tail).toEqual({ x: 2, y: 1 });
      done();
    });

    service['moveSnake']();
  });

  it('should not set direction if it is opposite to the current one', (done) => {
    service.setup({
      snake: new Snake(
        [
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ],
        Direction.Up,
      ),
    });
    service.setDirection(Direction.Up);

    service.state$.pipe(skip(1), take(1)).subscribe(({ snake }) => {
      // should move the snake "up", not "down"
      expect(snake.head).toEqual({ x: 1, y: 1 });
      expect(snake.tail).toEqual({ x: 1, y: 2 });
      done();
    });

    // it shouldn't change the direction because it's the opposite and the snake would hit itself in the neck
    service.setDirection(Direction.Down);
    service['moveSnake']();
  });

  it('should grow the snake when it eats food', (done) => {
    service.setup({
      snake: new Snake([
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ]),
      food: { x: 3, y: 1 },
    });

    service.state$.pipe(skip(1), take(1)).subscribe(({ snake }) => {
      expect(snake.head).toEqual({ x: 3, y: 1 });
      expect(snake.body).toEqual([{ x: 2, y: 1 }]);
      expect(snake.tail).toEqual({ x: 1, y: 1 });
      done();
    });

    service['moveSnake']();
  });

  it('should stop the game when the snake hits the wall', (done) => {
    service.setup({
      snake: new Snake([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ]),
    });

    service.state$.pipe(skip(1), take(1)).subscribe(({ status }) => {
      expect(status).toBe(GameStatus.GameOver);
      done();
    });

    service['moveSnake']();
  });

  it('should stop the game when the snake hits itself', (done) => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ]),
    });

    service.state$.pipe(skip(1), take(1)).subscribe(({ status }) => {
      expect(status).toBe(GameStatus.GameOver);
      done();
    });

    service['moveSnake']();
  });
});
