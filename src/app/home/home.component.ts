import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from '../webcam/webcam.component';
import { GameBoardComponent } from '../game/game-board/game-board.component';
import { GameService } from '../game/game.service';

@Component({
  selector: 'snake-home',
  standalone: true,
  imports: [CommonModule, WebcamComponent, GameBoardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild(WebcamComponent)
  private webcamComponent?: WebcamComponent;

  public get webcamLoaded$() {
    return this.webcamComponent?.webcamLoaded$;
  }

  public get gameState$() {
    return this.gameService.state$;
  }

  public constructor(private gameService: GameService) {
    this.gameService.setup();
  }

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
