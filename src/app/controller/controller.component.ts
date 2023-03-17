import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from './webcam/webcam.component';
import { ArrowsComponent } from './arrows/arrows.component';
import { Direction } from '../game/game.model';
import { ControlButtonsComponent } from './control-buttons/control-buttons.component';

@Component({
  selector: 'snake-controller',
  standalone: true,
  imports: [
    CommonModule,
    ArrowsComponent,
    WebcamComponent,
    ControlButtonsComponent,
  ],
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent {
  private directionInternal: Direction = Direction.Right;

  public get direction(): Direction {
    return this.directionInternal;
  }
  public directionChange(direction: Direction): void {
    this.directionInternal = direction;
  }
}
