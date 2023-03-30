import { TestBed } from '@angular/core/testing';
import { Snake, DEFAULT_DIRECTION, GameStatus, Direction } from './game.model';

import { SignalsGameService } from './signals-game.service';

describe('SignalsGameService', () => {
  let service: SignalsGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalsGameService],
    });
    service = TestBed.inject(SignalsGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setup the game with default values', () => {
    service.setup();

    expect(service.state().snake.head).toBeDefined();
    expect(service.state().snake.body.length).toBe(0);
    expect(service.state().snake.direction).toBe(DEFAULT_DIRECTION);
    expect(service.state().food).toBeDefined();
    expect(service.state().status).toBe(GameStatus.Initial);
  });

  it('should setup the game with provided values', () => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
      food: { x: 2, y: 2 },
      initialSpeed: 3,
    });

    expect(service['speed']).toBe(3);

    expect(service.state()).toEqual({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
      food: { x: 2, y: 2 },
      status: GameStatus.Initial,
    });
  });

  it('should reposition food when it is on top of the snake', () => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ]),
      food: { x: 2, y: 1 },
    });

    const food = service.state().food;
    expect(food).not.toBe({ x: 2, y: 1 });
    expect(service['isPointOnSnake'](food)).toBe(false);
  });

  it('should start game', () => {
    service.start();
    expect(service.running).toBe(true);
  });

  it('should pause game', () => {
    service.pause();
    expect(service.state().status).toBe(GameStatus.Paused);
  });

  it('should move the snake', () => {
    service.setup({
      snake: new Snake([
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ]),
    });

    service['moveSnake']();

    const snake = service.state().snake;
    expect(snake.head).toEqual({ x: 3, y: 1 });
    expect(snake.body).toEqual([{ x: 2, y: 1 }]);
    expect(snake.tail).toEqual({ x: 1, y: 1 });
  });

  it('should move the snake in the correct direction', () => {
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

    service['moveSnake']();

    const snake = service.state().snake;
    expect(snake.head).toEqual({ x: 2, y: 2 });
    expect(snake.tail).toEqual({ x: 2, y: 1 });
  });

  it('should not set direction if it is opposite to the current one', () => {
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

    // it shouldn't change the direction because it's the opposite and the snake would hit itself in the neck
    service.setDirection(Direction.Down);
    service['moveSnake']();

    const snake = service.state().snake;
    // should move the snake "up", not "down"
    expect(snake.head).toEqual({ x: 1, y: 1 });
    expect(snake.tail).toEqual({ x: 1, y: 2 });
  });

  it('should grow the snake when it eats food', () => {
    service.setup({
      snake: new Snake([
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ]),
      food: { x: 3, y: 1 },
    });

    service['moveSnake']();

    const snake = service.state().snake;
    expect(snake.head).toEqual({ x: 3, y: 1 });
    expect(snake.body).toEqual([{ x: 2, y: 1 }]);
    expect(snake.tail).toEqual({ x: 1, y: 1 });
  });

  it('should stop the game when the snake hits the wall', () => {
    service.setup({
      snake: new Snake([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ]),
    });

    service['moveSnake']();
    expect(service.state().status).toBe(GameStatus.GameOver);
  });

  it('should stop the game when the snake hits itself', () => {
    service.setup({
      snake: new Snake([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ]),
    });

    service['moveSnake']();
    expect(service.state().status).toBe(GameStatus.GameOver);
  });
});
