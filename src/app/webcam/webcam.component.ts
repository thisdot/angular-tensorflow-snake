import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { NAVIGATOR, NAVIGATOR_PROVIDERS } from './navigator.service';

import '@tensorflow/tfjs-backend-webgl';
import * as handdetection from '@tensorflow-models/hand-pose-detection';
import { Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'snake-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  providers: [NAVIGATOR_PROVIDERS],
  imports: [AsyncPipe],
})
export class WebcamComponent {
  @ViewChild('webcam', { static: true, read: ElementRef })
  webcam!: ElementRef<HTMLVideoElement>;

  public detector?: handdetection.HandDetector;

  public direction$ = new Subject<string>();

  constructor(
    @Inject(NAVIGATOR) private navigator: Navigator,
    private zone: NgZone
  ) {
    this.navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((localMediaStream) => {
        const nativeElement = this.webcam.nativeElement;
        nativeElement.srcObject = localMediaStream;
        nativeElement.play();

        this.createDetector();
      })
      .catch((err) => {
        console.error(`Something bad happened!`, err);
      });
  }

  public createDetector() {
    handdetection
      .createDetector(handdetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs',
        modelType: 'lite',
      })
      .then((detector) => {
        this.detector = detector;
        this.runDetection();
      });
  }

  public runDetection() {
    if (this.detector) {
      this.detector
        .estimateHands(this.webcam.nativeElement)
        .then((predictions) => {
          this.zone.runOutsideAngular(() => {
            if (predictions.length === 0) {
              requestAnimationFrame(() => this.runDetection());
              return;
            }

            const direction = this.getHandDirection(predictions[0].keypoints);
            this.zone.run(() => {
              this.direction$.next(direction);
            });

            requestAnimationFrame(() => this.runDetection());
          });
        });
    }
  }

  private getHandDirection(keypoints: handdetection.Keypoint[]): string {
    // prepare relevant keypoints (filter out what we won't need)
    keypoints = keypoints.filter(
      (keypoint) =>
        !keypoint.name?.startsWith('thumb') &&
        (keypoint.name?.endsWith('_tip') || keypoint.name === 'wrist')
    );

    const wrist = keypoints.find((keypoint) => keypoint.name === 'wrist') ?? {
      x: 0,
      y: 0,
    };

    const fingerTips = [
      ...keypoints.filter((keypoint) => keypoint?.name?.endsWith('_tip')),
    ].sort((a, b) => b.y - a.y);
    const upmostTip = fingerTips[0];

    const deltaVertical = upmostTip.y - wrist.y;
    fingerTips.sort((a, b) => b.x - a.x);
    const rightmostTip = fingerTips[0];
    const deltaHorizontal = rightmostTip.x - wrist.x;
    console.log({ deltaHorizontal, deltaVertical });
    let direction = deltaHorizontal > 0 ? 'left' : 'right';
    const axis =
      Math.abs(deltaHorizontal) > Math.abs(deltaVertical)
        ? 'horizontal'
        : 'vertical';
    if (axis === 'vertical') {
      direction = deltaVertical > 0 ? 'down' : 'up';
    }
    return direction;
  }
}
