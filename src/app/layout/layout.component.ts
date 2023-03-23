import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from '../controller/webcam/webcam.component';
import { ControlButtonsComponent } from '../controller/control-buttons/control-buttons.component';
import { ControllerComponent } from '../controller/controller.component';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';
import { InstructionsComponent } from '../game/instructions/instructions.component';
import { GameServiceBase } from '../game/game.service.base';
import { CableComponent } from './cable.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'snake-layout',
  standalone: true,
  imports: [
    CommonModule,
    ControllerComponent,
    ControlButtonsComponent,
    CableComponent,
    OverlayModule,
    RouterOutlet,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();

  @ViewChild(WebcamComponent)
  private webcamComponent?: WebcamComponent;

  public get controlsInitialized(): boolean {
    return !!(
      this.webcamComponent?.cameraFeedInitialized &&
      this.webcamComponent?.handDetectorInitialized
    );
  }

  public constructor(
    private gameService: GameServiceBase,
    private overlay: Overlay,
  ) {
    this.gameService.setup({
      gridSize: { width: 22, height: 12 },
    });
    if (sessionStorage.getItem('controlsInitialized') !== 'true') {
      this.openInstructions();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private openInstructions(): void {
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
    componentRef.instance.modal = true;
    componentRef.instance.closeInstructions
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => overlayRef.dispose());
  }
}
