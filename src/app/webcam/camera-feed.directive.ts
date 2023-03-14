import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { NAVIGATOR, NAVIGATOR_PROVIDERS } from './navigator.service';

@Directive({
  selector: '[snakeCameraFeed]',
  standalone: true,
  providers: [NAVIGATOR_PROVIDERS],
})
export class CameraFeedDirective implements OnDestroy {
  @Output()
  public cameraFeedCreated = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef<HTMLVideoElement>,
    @Inject(NAVIGATOR) private navigator: Navigator,
    private zone: NgZone,
  ) {
    if (typeof this.elementRef.nativeElement.play !== 'function') {
      throw new Error(
        'Oops! Looks like you added the CameraFeedDirective to the wrong element. It only works on <video> elements.',
      );
    }

    this.zone.runOutsideAngular(() => {
      this.navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
          const nativeElement = this.elementRef.nativeElement;
          nativeElement.srcObject = localMediaStream;
          nativeElement.play();
          this.cameraFeedCreated.emit();
        })
        .catch((err) => {
          console.error(`Oops. Could not initialize camera stream!`, err);
        });
    });
  }

  ngOnDestroy() {
    const nativeElement = this.elementRef.nativeElement;
    if (nativeElement.srcObject) {
      const localMediaStream = nativeElement.srcObject as MediaStream;
      localMediaStream.getTracks().forEach((track) => track.stop());
      nativeElement.srcObject = null;
    }
  }
}
