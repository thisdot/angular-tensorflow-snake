import { Component } from '@angular/core';
import { WebcamComponent } from './webcam/webcam.component';

@Component({
  selector: 'snake-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [WebcamComponent],
  standalone: true,
})
export class AppComponent {
  title = 'angular-tensorflow-snake';
}
