import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Cell, CELL_SIZE, Character, Point } from '../definitions';

@Component({
  selector: 'eka-map',
  template: `
    <eka-map-grid   [columns]="columns" [rows]="rows" [cellSize]="cellSize"
    ></eka-map-grid>
    <eka-map-bg     [columns]="columns" [rows]="rows" [cellSize]="cellSize" [mapInfo]="mapInfo"
    ></eka-map-bg>
    <eka-map-chars  [columns]="columns" [rows]="rows" [cellSize]="cellSize" [charInfo]="charInfo"
    ></eka-map-chars>
    <eka-map-hls    [columns]="columns" [rows]="rows" [cellSize]="cellSize" (hoverCell)="onHover($event)"
    ></eka-map-hls>
  `,
  styles: [':host { display: block; position: relative; }']
})
export class MapComponent implements OnInit {
  @Input() charInfo: Character[];
  @Input() mapInfo: Cell[];
  @Output() hoverCell = new EventEmitter<Point>();

  cellSize: number = CELL_SIZE;
  columns: number;
  rows: number;

  @HostBinding('style') style = this.calculateStyle();

  ngOnInit() {
    const { rows, columns } = this.calculateDimensions();
    this.rows = rows;
    this.columns = columns;
    this.style = this.calculateStyle();
  }

  onHover(point: Point) {
    this.hoverCell.emit(point);
  }

  private calculateStyle() {
    return `height: ${this.rows * this.cellSize}px; width: ${this.columns * this.cellSize}px;`;
  }

  private calculateDimensions() {
    return {
      columns: Math.max(...this.mapInfo.map(cell => cell.x)) + 1,
      rows: Math.max(...this.mapInfo.map(cell => cell.y)) + 1
    };
  }
}
