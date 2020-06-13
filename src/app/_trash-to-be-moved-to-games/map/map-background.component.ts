import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Cell } from '../definitions';
import { CANVAS_STYLE, CANVAS_TEMPLATE, MapCanvasHandler } from './map-canvas-handler';

@Component({
  selector: 'eka-map-bg',
  template: CANVAS_TEMPLATE,
  styles: [CANVAS_STYLE]
})
export class MapBackgroundComponent extends MapCanvasHandler implements OnChanges {
  @Input() mapInfo: Cell[];

  protected setUp() {
    this.drawMap();
  }

  ngOnChanges({ mapInfo }: SimpleChanges): void {
    if (!mapInfo.previousValue) {
      return;
    }

    this.filterChangedCells(mapInfo).forEach(this.redrawCell.bind(this));
  }

  private filterChangedCells({ previousValue, currentValue }) {
    return currentValue.filter((cell: Cell, i: number) => Cell.shouldRedraw(cell, previousValue[i]));
  }

  private drawMap() {
    if (!this.mapInfo) {
      return;
    }

    this.clearCanvas();
    this.mapInfo.forEach(cell => this.drawCell(cell));
  }

  private drawCell({ x, y, type }: Cell) {
    if (type) {
      this.drawImage(x, y, `/assets/icons/${type}.png`);
    }
  }

  private redrawCell(cell: Cell) {
    this.clearCell(cell);
    this.drawCell(cell);
  }
}
