import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { Coordinates, GridSize, Snake } from '../game.model';
import { GameUtils } from '../game.utils';
import { map, Observable, Subject, withLatestFrom } from 'rxjs';
import { Tile } from './game-board.model';

@Component({
  selector: 'snake-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  public tiles$: Observable<Tile[]> = this.gameService.state$
    .pipe(withLatestFrom(this.gameService.gridSize$))
    .pipe(
      map(([{ snake, food }, { width, height }]) =>
        [...Array(width * height).keys()].map((i) => {
          const coordinates = this.getPointFromIndex(i, width);
          const hasSnakeBody = this.hasSnakeBody(coordinates, snake);
          const hasSnakeHead = GameUtils.arePointsEqual(
            coordinates,
            snake?.head
          );
          const hasFood = GameUtils.arePointsEqual(coordinates, food);
          return {
            coordinates,
            hasSnakeBody,
            hasSnakeHead,
            hasFood,
          };
        })
      )
    );
  public gridSize$: Observable<GridSize> = this.gameService.gridSize$;

  public constructor(private gameService: GameService) {}

  private hasSnakeBody(tile: Coordinates, snake?: Snake | null) {
    return (
      !!snake &&
      snake.body.some((segment) => GameUtils.arePointsEqual(segment, tile))
    );
  }

  private getPointFromIndex(index: number, width: number): Coordinates {
    return {
      x: index % width,
      y: Math.floor(index / width),
    };
  }
}
