import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([{ path: '', component: HomeComponent }])],
});
