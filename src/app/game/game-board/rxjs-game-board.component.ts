import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxjsGameService } from '../rxjs-game.service';
import { GameStatus, GridSize } from '../game.model';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Tile } from './game-board.model';
import { GameTileComponent } from './game-tile.component';
import { computeTiles } from './game-board.utils';

@Component({
  selector: 'snake-rxjs-game-board',
  standalone: true,
  imports: [CommonModule, GameTileComponent],
  templateUrl: './rxjs-game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class RxjsGameBoardComponent {
  public tiles$: Observable<Tile[]> = this.gameService.state$
    .pipe(withLatestFrom(this.gameService.gridSize$))
    .pipe(
      map(([{ snake, food }, { width, height }]) =>
        computeTiles(width, height, snake, food),
      ),
    );
  public gridSize$: Observable<GridSize> = this.gameService.gridSize$;
  public gameOver$: Observable<boolean> = this.gameService.state$.pipe(
    map((state) => state.status === GameStatus.GameOver),
  );

  public constructor(private gameService: RxjsGameService) {}
}
