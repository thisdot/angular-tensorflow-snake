import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { CameraFeedDirective } from '../../controller/webcam/camera-feed.directive';
import { Direction } from '../game.model';
import { HandDetectorDirective } from '../../controller/webcam/hand-detector.directive';

@Component({
  selector: 'snake-instructions',
  standalone: true,
  imports: [CommonModule, NgClass, CameraFeedDirective, HandDetectorDirective],
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
})
export class InstructionsComponent {
  private controlsInitializedInternal = false;
  private creditsExpandedInternal = false;

  @ViewChild('scrollContainer', { static: true })
  private scrollContainer?: ElementRef;

  public scrollHeight = signal(0);

  @Output() closeInstructions = new EventEmitter<void>();

  @Input() public modal = false;

  public get controlsInitialized(): boolean {
    return this.controlsInitializedInternal;
  }

  public get creditsExpanded(): boolean {
    return this.creditsExpandedInternal;
  }

  public close(): void {
    this.closeInstructions.emit();
  }

  public directionChange(direction: Direction): void {
    if (direction === Direction.Right) {
      this.controlsInitializedInternal = true;
    }
  }

  public play(): void {
    sessionStorage.setItem('controlsInitialized', 'true');
    this.closeInstructions.emit();
  }

  public toggleCredits(): void {
    this.creditsExpandedInternal = !this.creditsExpandedInternal;
    setTimeout(() => {
      this.scrollHeight.set(
        this.scrollContainer?.nativeElement.scrollHeight ?? 0,
      );
    }, 0);
  }

  public creditsSectionShown(): void {
    this.scrollHeight.set(
      this.scrollContainer?.nativeElement.scrollHeight ?? 0,
    );
  }
}
