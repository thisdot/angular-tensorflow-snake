import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { WebcamComponent } from './webcam/webcam.component';
import { ArrowsComponent } from './arrows/arrows.component';
import { Direction } from '../game/game.model';
import { ControlButtonsComponent } from './control-buttons/control-buttons.component';
import { InstructionsComponent } from '../game/instructions/instructions.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'snake-controller',
  standalone: true,
  imports: [
    CommonModule,
    ArrowsComponent,
    WebcamComponent,
    ControlButtonsComponent,
    InstructionsComponent,
    OverlayModule,
  ],
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnDestroy {
  private directionInternal: Direction = Direction.Right;
  private unsubscribe = new Subject<void>();

  public constructor(private overlay: Overlay) {}

  public get direction(): Direction {
    return this.directionInternal;
  }
  public directionChange(direction: Direction): void {
    this.directionInternal = direction;
  }
  public showInstructions(): void {
    // open a modal with InstructionsComponent using Angular CDK overlay
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: '90vw',
      height: '96vh',
    });
    const componentRef = overlayRef.attach(
      new ComponentPortal(InstructionsComponent),
    );
    componentRef.instance.closeInstructions
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => overlayRef.dispose());
    overlayRef
      .backdropClick()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => overlayRef.dispose());
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
