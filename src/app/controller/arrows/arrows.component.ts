import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Direction } from '../../game/game.model';

@Component({
  selector: 'snake-arrows',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss'],
})
export class ArrowsComponent {
  private directionClassInternal: 'up' | 'down' | 'left' | 'right' = 'right';

  @HostBinding('class')
  public get directionClass(): string {
    return `direction--${this.directionClassInternal}`;
  }

  @Input()
  public set direction(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.directionClassInternal = 'up';
        break;
      case Direction.Down:
        this.directionClassInternal = 'down';
        break;
      case Direction.Left:
        this.directionClassInternal = 'left';
        break;
      case Direction.Right:
        this.directionClassInternal = 'right';
        break;
    }
  }
}
