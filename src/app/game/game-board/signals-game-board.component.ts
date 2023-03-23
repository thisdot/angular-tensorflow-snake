import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatus, GridSize } from '../game.model';
import { Tile } from './game-board.model';
import { GameTileComponent } from './game-tile.component';
import { GameServiceBase } from '../game.service.base';
import { SignalsGameService } from '../signals-game.service';
import { GameBoardUtils } from './game-board.utils';

@Component({
  selector: 'snake-signals-game-board',
  standalone: true,
  imports: [CommonModule, GameTileComponent],
  templateUrl: './signals-game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class SignalsGameBoardComponent {
  private get gameService(): SignalsGameService {
    return this.injectedGameService as SignalsGameService;
  }

  public tiles: Signal<Tile[]> = computed(() => {
    const { snake, food } = this.gameService.state();
    const { width, height } = this.gameService.gridSize();
    return GameBoardUtils.computeTiles(width, height, snake, food);
  });

  public gridSize: Signal<GridSize> = this.gameService.gridSize;

  public gameOver: Signal<boolean> = computed(
    () => this.gameService.state().status === GameStatus.GameOver,
  );

  public constructor(private injectedGameService: GameServiceBase) {}
}
