import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { WebcamComponent } from './app/webcam/webcam.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([{ path: '', component: WebcamComponent }])],
});
