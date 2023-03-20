import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../game/game.service';
import { map } from 'rxjs/operators';
import { GameStatus } from '../../game/game.model';

@Component({
  selector: 'snake-control-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss'],
})
export class ControlButtonsComponent {
  public gameRunning$ = this.gameService.state$.pipe(
    map(({ status }) => status === GameStatus.Running),
  );

  @Input()
  public initialized = false;

  public constructor(private gameService: GameService) {}

  public startGame(): void {
    this.gameService.start();
  }

  public pauseGame(): void {
    this.gameService.pause();
  }

  public resetGame(): void {
    this.gameService.setup({
      gridSize: { width: 22, height: 12 },
    });
  }
}
