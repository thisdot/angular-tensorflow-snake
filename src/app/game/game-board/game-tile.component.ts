import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from './game-board.model';

@Component({
  selector: 'snake-game-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss'],
})
export class GameTileComponent {
  @Input()
  public tile!: Tile;

  @HostBinding('class')
  public get tileClass() {
    return {
      snake: this.tile.hasSnakeBody,
      'snake-head': this.tile.hasSnakeHead,
      'snake-tail': this.tile.hasSnakeTail,
      food: this.tile.hasFood,
    };
  }

  @HostBinding('style.--rotation')
  public get rotation() {
    return this.tile.rotation;
  }
}
