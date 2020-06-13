import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Point } from '../definitions';
import { CANVAS_STYLE, CANVAS_TEMPLATE, MapCanvasHandler } from './map-canvas-handler';

const HIGHLIGHT_COLOR = 'rgb(233, 212, 96)';
const HIGHLIGHT_ALPHA = 0.4;

@Component({
  selector: 'eka-map-hls',
  template: CANVAS_TEMPLATE,
  styles: [CANVAS_STYLE]
})
export class MapHighlightComponent extends MapCanvasHandler {
  @Output() hoverCell = new EventEmitter<Point>();
  private highlightedCell: Point = null;

  protected setUp() {
    this.ctx.globalAlpha = HIGHLIGHT_ALPHA;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove({ clientX, clientY }: MouseEvent) {
    const { left, top } = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.floor((clientX - left) / this.cellSize);
    const y = Math.floor((clientY - top) / this.cellSize);

    this.highlightCell({ x, y });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlightCell(null);
  }

  private highlightCell(cell: Point) {
    cell = this.forceCellToGrid(cell);
    if (!Point.equals(this.highlightedCell, cell)) {
      this.clearCanvas();
      this.highlightedCell = cell;
      this.hoverCell.emit(cell);
      if (cell) {
        this.drawCellFill(cell.x, cell.y, HIGHLIGHT_COLOR);
      }
    }
  }

  private forceCellToGrid(cell: Point) {
    if (!cell) {
      return null;
    }
    const { x, y } = cell;
    if (x < 0 || x >= this.columns || y < 0 || y >= this.rows ) {
      return null;
    }
    return cell;
  }

  private drawCellFill(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  }
}
