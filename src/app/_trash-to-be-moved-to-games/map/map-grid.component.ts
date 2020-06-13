import { Component } from '@angular/core';
import { CANVAS_STYLE, CANVAS_TEMPLATE, MapCanvasHandler } from './map-canvas-handler';

const BORDER_COLOR = 'rgb(192, 192, 192)';

@Component({
  selector: 'eka-map-grid',
  template: CANVAS_TEMPLATE,
  styles: [CANVAS_STYLE]
})
export class MapGridComponent extends MapCanvasHandler {
  protected setUp() {
    this.drawGrid();
  }

  private drawGrid() {
    this.clearCanvas();

    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.drawCellBorders(x, y, BORDER_COLOR);
      }
    }
  }

  private drawCellBorders(x: number, y: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  }

}
