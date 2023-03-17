import { Component, EventEmitter, Output } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { HandDetectorDirective } from './hand-detector.directive';
import { CameraFeedDirective } from './camera-feed.directive';
import { GameService } from '../../game/game.service';
import { Direction } from '../../game/game.model';

@Component({
  selector: 'snake-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CameraFeedDirective, HandDetectorDirective],
})
export class WebcamComponent {
  private cameraFeedInitializedInternal = false;
  private handDetectorInitializedInternal = false;
  private estimatedDirectionInternal?: Direction;

  @Output()
  public detectedDirectionChange = new EventEmitter<Direction>();

  public get estimatedDirection(): Direction | undefined {
    return this.estimatedDirectionInternal;
  }

  public get cameraFeedInitialized() {
    return this.cameraFeedInitializedInternal;
  }

  public get handDetectorInitialized() {
    return this.handDetectorInitializedInternal;
  }

  constructor(private gameService: GameService) {}

  public estimatedDirectionChange(direction: Direction): void {
    this.estimatedDirectionInternal = direction;
    this.detectedDirectionChange.emit(direction);
    this.gameService.setDirection(direction);
  }

  public detectorCreated(): void {
    this.handDetectorInitializedInternal = true;
  }

  public cameraFeedCreated(): void {
    this.cameraFeedInitializedInternal = true;
  }
}
