import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Coordinates, GridSize, Snake } from '../game.model';
import { GameUtils } from '../game.utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'snake-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();
  private snake: Snake = [];
  private food: Coordinates = { x: 0, y: 0 };
  public gridSize: GridSize = { width: 0, height: 0 };

  public get tiles() {
    return [...Array(this.gridSize.width * this.gridSize.height).keys()];
  }

  public constructor(private gameService: GameService) {}

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public ngOnInit(): void {
    this.gameService.gridSize$.subscribe((gridSize) => {
      this.gridSize = gridSize;
    });

    this.gameService.state$.subscribe((state) => {
      this.snake = state.snake;
      this.food = state.food;
    });
  }

  public tileHasSnake(index: number) {
    return this.snake.some((tile) =>
      GameUtils.arePointsEqual(tile, this.getPointFromIndex(index))
    );
  }

  public tileHasSnakeHead(index: number) {
    return GameUtils.arePointsEqual(
      this.snake[0],
      this.getPointFromIndex(index)
    );
  }

  public tileHasFood(index: number) {
    return GameUtils.arePointsEqual(this.food, this.getPointFromIndex(index));
  }

  private getPointFromIndex(index: number): Coordinates {
    const x = index % this.gridSize.width;
    const y = Math.floor(index / this.gridSize.width);
    return { x, y };
  }
}
