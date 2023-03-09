import { Component, ViewChild } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { HandDetectorDirective } from './hand-detector.directive';
import { CameraFeedDirective } from './camera-feed.directive';

@Component({
  selector: 'snake-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  imports: [AsyncPipe, CameraFeedDirective, HandDetectorDirective],
})
export class WebcamComponent {
  @ViewChild(HandDetectorDirective) handDetector?: HandDetectorDirective;

  public get estimatedDirection$() {
    return this.handDetector?.direction$;
  }
}
