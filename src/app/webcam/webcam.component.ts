import { Component } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { HandDetectorDirective } from './hand-detector.directive';
import { CameraFeedDirective } from './camera-feed.directive';
import { GameService } from '../game/game.service';
import { Subject } from 'rxjs';
import { Direction } from '../game/game.model';

@Component({
  selector: 'snake-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CameraFeedDirective, HandDetectorDirective],
})
export class WebcamComponent {
  private webcamLoadedSource = new Subject<boolean>();
  private estimatedDirectionInternal?: Direction;

  public get estimatedDirection(): Direction | undefined {
    return this.estimatedDirectionInternal;
  }

  public webcamLoaded$ = this.webcamLoadedSource.asObservable();

  constructor(private gameService: GameService) {}

  public estimatedDirectionChange(direction: Direction): void {
    this.estimatedDirectionInternal = direction;
    this.gameService.setDirection(direction);
  }

  public detectorCreated(): void {
    this.webcamLoadedSource.next(true);
  }
}
