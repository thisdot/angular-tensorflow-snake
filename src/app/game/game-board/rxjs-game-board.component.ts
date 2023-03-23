import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxjsGameService } from '../rxjs-game.service';
import { Coordinates, GameStatus, GridSize, Snake } from '../game.model';
import { GameUtils } from '../game.utils';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Tile } from './game-board.model';
import { GameTileComponent } from './game-tile.component';
import { GameServiceBase } from '../game.service.base';

@Component({
  selector: 'snake-rxjs-game-board',
  standalone: true,
  imports: [CommonModule, GameTileComponent],
  templateUrl: './rxjs-game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class RxjsGameBoardComponent {
  private get gameService(): RxjsGameService {
    return this.injectedGameService as RxjsGameService;
  }

  public tiles$: Observable<Tile[]> = this.gameService.state$
    .pipe(withLatestFrom(this.gameService.gridSize$))
    .pipe(
      map(([{ snake, food }, { width, height }]) =>
        [...Array(width * height).keys()].map((i) => {
          const coordinates = this.getPointFromIndex(i, width);
          const hasSnakeBody = this.hasSnakeBody(coordinates, snake);
          const hasSnakeHead = GameUtils.arePointsEqual(
            coordinates,
            snake?.head,
          );
          const hasSnakeTail = GameUtils.arePointsEqual(
            coordinates,
            snake?.tail,
          );
          const rotation = hasSnakeHead
            ? GameUtils.rotationFromDirection(snake?.direction)
            : hasSnakeTail && snake?.tailDirection
            ? GameUtils.rotationFromDirection(snake.tailDirection)
            : null;
          const hasFood = GameUtils.arePointsEqual(coordinates, food);
          return {
            coordinates,
            hasSnakeBody,
            hasSnakeHead,
            hasSnakeTail,
            hasFood,
            rotation,
          };
        }),
      ),
    );
  public gridSize$: Observable<GridSize> = this.gameService.gridSize$;
  public gameOver$: Observable<boolean> = this.gameService.state$.pipe(
    map((state) => state.status === GameStatus.GameOver),
  );

  public constructor(private injectedGameService: GameServiceBase) {}

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
