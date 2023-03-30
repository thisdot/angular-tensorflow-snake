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
import { Direction } from '../../game/game.model';

type Delta = {
  direction: Direction;
  delta: number;
};

type Keypoint3D = handdetection.Keypoint & { z: number };

type FingerName =
  | 'thumb'
  | 'index_finger'
  | 'middle_finger'
  | 'ring_finger'
  | 'pinky_finger';

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
    private zone: NgZone,
  ) {
    if (typeof this.elementRef.nativeElement.play !== 'function') {
      throw new Error(
        'Oops! Looks like you added the HandDetectorDirective to the wrong element. It only works on <video> elements.',
      );
    }
    this.createDetector();
  }

  public ngOnDestroy(): void {
    tf.dispose();
    this.detector = undefined;
  }

  public createDetector() {
    handdetection
      .createDetector(handdetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs',
        modelType: 'lite',
        maxHands: 1,
      })
      .then((detector) => {
        this.detector = detector;
        this.detectorCreated.emit();
        this.runDetection();
      });
  }

  private runDetection() {
    if (this.detector) {
      if (this.elementRef.nativeElement.readyState !== 4) {
        // video not ready, try again
        requestAnimationFrame(() => this.runDetection());
        return;
      }
      this.detector
        .estimateHands(this.elementRef.nativeElement)
        .then((predictions) => {
          this.zone.runOutsideAngular(() => {
            if (predictions.length === 0) {
              requestAnimationFrame(() => this.runDetection());
              return;
            }

            const direction = this.getHandDirection(
              predictions[0].keypoints,
              this.estimateCurledFingers(
                predictions[0].keypoints3D as Keypoint3D[],
              ),
            );
            this.zone.run(() => {
              this.directionChange.emit(direction);
            });

            requestAnimationFrame(() => this.runDetection());
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  private getHandDirection(
    keypoints: handdetection.Keypoint[],
    curledFingers: FingerName[],
  ): Direction {
    const centerPoint = this.calculateCenterPoint(keypoints);

    // prepare relevant keypoints (filter out what we won't need)
    const fingerTips = keypoints.filter(
      (keypoint) =>
        keypoint.name?.endsWith('_tip') &&
        !curledFingers.some((f) => keypoint.name?.startsWith(f)),
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
        delta: leftmostFingerPoint.x - centerPoint.x,
      },
      {
        direction: Direction.Right,
        delta: centerPoint.x - rightmostFingerPoint.x,
      },
      { direction: Direction.Up, delta: centerPoint.y - upmostFingerPoint.y },
      {
        direction: Direction.Down,
        delta: downmostFingerPoint.y - centerPoint.y,
      },
    ];

    deltas.sort((a, b) => b.delta - a.delta);

    return deltas[0].direction;
  }
  private calculateCenterPoint(
    points: handdetection.Keypoint[],
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

  private isFingerCurl(
    fingerTip?: Keypoint3D,
    fingerDip?: Keypoint3D,
    fingerPip?: Keypoint3D,
    fingerMcp?: Keypoint3D,
  ): boolean {
    if (!fingerTip || !fingerDip || !fingerPip || !fingerMcp) {
      return false;
    }
    const dx1 = fingerTip.x - fingerDip.x;
    const dy1 = fingerTip.y - fingerDip.y;
    const dz1 = fingerTip.z - fingerDip.z;

    const dx2 = fingerPip.x - fingerMcp.x;
    const dy2 = fingerPip.y - fingerMcp.y;
    const dz2 = fingerPip.z - fingerMcp.z;

    return dx1 * dx2 + dy1 * dy2 + dz1 * dz2 < 0;
  }

  private estimateCurledFingers(points: Keypoint3D[]): FingerName[] {
    const pointMap = new Map(points.map((p) => [p.name, p]));

    const curledFingers: FingerName[] = [];

    const fingers: FingerName[] = [
      'index_finger',
      'middle_finger',
      'ring_finger',
      'pinky_finger',
    ];

    for (const finger of fingers) {
      if (
        this.isFingerCurl(
          pointMap.get(`${finger}_tip`),
          pointMap.get(`${finger}_dip`),
          pointMap.get(`${finger}_pip`),
          pointMap.get(`${finger}_mcp`),
        )
      ) {
        curledFingers.push(finger);
      }
    }

    return curledFingers;
  }
}
