import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GameService } from '../game/game.service';

@Component({
  selector: 'snake-control-buttons',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss'],
})
export class ControlButtonsComponent {
  public gameState$ = this.gameService.state$;

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
    this.gameService.setup();
  }
}
