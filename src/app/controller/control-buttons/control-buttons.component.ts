import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameServiceBase } from '../../game/game.service.base';

@Component({
  selector: 'snake-control-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss'],
})
export class ControlButtonsComponent {
  public get gameRunning(): boolean {
    return this.gameService.running;
  }

  @Input()
  public initialized = false;

  public constructor(private gameService: GameServiceBase) {}

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
