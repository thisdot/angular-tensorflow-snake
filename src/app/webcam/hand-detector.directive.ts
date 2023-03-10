import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';

import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handdetection from '@tensorflow-models/hand-pose-detection';
import { Direction } from '../game/game.model';

type Delta = {
  direction: Direction;
  delta: number;
};

@Directive({
  selector: '[snakeHandDetector]',
  standalone: true,
})
export class HandDetectorDirective implements OnDestroy {
  @Output()
  public directionChange = new EventEmitter<Direction>();

  @Output()
  public detectorCreated = new EventEmitter<void>();

  public detector?: handdetection.HandDetector;

  constructor(
    private elementRef: ElementRef<HTMLVideoElement>,
    private zone: NgZone
  ) {
    if (typeof this.elementRef.nativeElement.play !== 'function') {
      throw new Error(
        'Oops! Looks like you added the HandDetectorDirective to the wrong element. It only works on <video> elements.'
      );
    }
    this.createDetector();
  }

  public ngOnDestroy(): void {
    tf.dispose();
    this.detector?.reset();
    this.detector?.dispose();
    this.detector = undefined;
  }

  public createDetector() {
    console.log('create det');
    handdetection
      .createDetector(handdetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs',
        modelType: 'lite',
      })
      .then((detector) => {
        this.detector = detector;
        this.detectorCreated.emit();
        this.runDetection();
      });
  }

  private runDetection() {
    if (this.detector) {
      this.detector
        .estimateHands(this.elementRef.nativeElement)
        .then((predictions) => {
          this.zone.runOutsideAngular(() => {
            if (predictions.length === 0) {
              requestAnimationFrame(() => this.runDetection());
              return;
            }

            const direction = this.getHandDirection(predictions[0].keypoints);
            this.zone.run(() => {
              this.directionChange.emit(direction);
            });

            requestAnimationFrame(() => this.runDetection());
          });
        });
    }
  }

  private getHandDirection(keypoints: handdetection.Keypoint[]): Direction {
    const centerPoint = this.calculateCenterPoint(keypoints);

    // prepare relevant keypoints (filter out what we won't need)
    const fingerTips = keypoints.filter((keypoint) =>
      keypoint.name?.endsWith('_tip')
    );

    fingerTips.sort((a, b) => b.y - a.y);
    const downmostFingerPoint = fingerTips[0];
    const upmostFingerPoint = fingerTips[fingerTips.length - 1];

    fingerTips.sort((a, b) => b.x - a.x);
    const leftmostFingerPoint = fingerTips[0];
    const rightmostFingerPoint = fingerTips[fingerTips.length - 1];

    const deltas: Delta[] = [
      {
        direction: Direction.Left,
        delta: centerPoint.x - leftmostFingerPoint.x,
      },
      {
        direction: Direction.Right,
        delta: rightmostFingerPoint.x - centerPoint.x,
      },
      { direction: Direction.Up, delta: centerPoint.y - upmostFingerPoint.y },
      {
        direction: Direction.Down,
        delta: downmostFingerPoint.y - centerPoint.y,
      },
    ];

    deltas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    return deltas[0].direction;
  }

  private calculateCenterPoint(
    points: handdetection.Keypoint[]
  ): handdetection.Keypoint {
    const numPoints = points.length;
    let sumX = 0;
    let sumY = 0;

    for (const point of points) {
      sumX += point.x;
      sumY += point.y;
    }

    return {
      x: sumX / numPoints,
      y: sumY / numPoints,
    };
  }
}
