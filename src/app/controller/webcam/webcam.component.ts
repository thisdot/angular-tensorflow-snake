import { Component, EventEmitter, Output } from '@angular/core';

import { AsyncPipe, NgClass } from '@angular/common';
import { HandDetectorDirective } from './hand-detector.directive';
import { CameraFeedDirective } from './camera-feed.directive';
import { Direction } from '../../game/game.model';
import { GameServiceBase } from '../../game/game.service.base';

@Component({
  selector: 'snake-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CameraFeedDirective, HandDetectorDirective, NgClass],
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

  constructor(private gameService: GameServiceBase) {}

  public estimatedDirectionChange(direction: Direction): void {
    this.estimatedDirectionInternal = direction;
    this.gameService.setDirection(direction);
    this.detectedDirectionChange.emit(direction);
  }

  public detectorCreated(): void {
    this.handDetectorInitializedInternal = true;
  }

  public cameraFeedCreated(): void {
    this.cameraFeedInitializedInternal = true;
  }
}
