import { Directive, ElementRef, Inject, NgZone } from '@angular/core';
import { NAVIGATOR, NAVIGATOR_PROVIDERS } from './navigator.service';

@Directive({
  selector: '[snakeCameraFeed]',
  standalone: true,
  providers: [NAVIGATOR_PROVIDERS],
})
export class CameraFeedDirective {
  constructor(
    private elementRef: ElementRef<HTMLVideoElement>,
    @Inject(NAVIGATOR) private navigator: Navigator,
    private zone: NgZone
  ) {
    this.zone.runOutsideAngular(() => {
      this.navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
          const nativeElement = this.elementRef.nativeElement;
          nativeElement.srcObject = localMediaStream;
          nativeElement.play();
        })
        .catch((err) => {
          console.error(`Oops. Coul not initialize camera stream!`, err);
        });
    });
  }
}
