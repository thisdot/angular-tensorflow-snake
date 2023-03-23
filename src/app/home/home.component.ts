import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from '../controller/webcam/webcam.component';
import { GameBoardComponent } from '../game/game-board/game-board.component';
import { GameService } from '../game/game.service';
import { ControlButtonsComponent } from '../controller/control-buttons/control-buttons.component';
import { ControllerComponent } from '../controller/controller.component';

@Component({
  selector: 'snake-home',
  standalone: true,
  imports: [
    CommonModule,
    ControllerComponent,
    GameBoardComponent,
    ControlButtonsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild(WebcamComponent)
  private webcamComponent?: WebcamComponent;

  public get controlsInitialized(): boolean {
    return !!(
      this.webcamComponent?.cameraFeedInitialized &&
      this.webcamComponent?.handDetectorInitialized
    );
  }

  public get gameState$() {
    return this.gameService.state$;
  }

  public constructor(private gameService: GameService) {
    this.gameService.setup({
      gridSize: { width: 22, height: 12 },
    });
  }
}
