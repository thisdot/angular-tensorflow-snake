import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatus, GridSize } from '../game.model';
import { Tile } from './game-board.model';
import { GameTileComponent } from './game-tile.component';
import { SignalsGameService } from '../signals-game.service';
import { computeTiles, constructTwitterShareUrl } from './game-board.utils';

@Component({
  selector: 'snake-signals-game-board',
  standalone: true,
  imports: [CommonModule, GameTileComponent],
  templateUrl: './signals-game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class SignalsGameBoardComponent {
  public tiles: Signal<Tile[]> = computed(() => {
    const { snake, food } = this.gameService.state();
    const { width, height } = this.gameService.gridSize();
    return computeTiles(width, height, snake, food);
  });

  public gridSize: Signal<GridSize> = this.gameService.gridSize;

  public gameOver: Signal<boolean> = computed(
    () => this.gameService.state().status === GameStatus.GameOver,
  );

  public score = computed(
    () => this.gameService.state().snake.segments.length - 1,
  );

  public constructor(private gameService: SignalsGameService) {}

  public twitterShareUrl(): string {
    return constructTwitterShareUrl(this.score());
  }
}
