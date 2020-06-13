import { AfterViewInit, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

export const CANVAS_TEMPLATE = '<canvas #canvas [width]="cWidth" [height]="cHeight"></canvas>';
export const CANVAS_STYLE = ':host { height: 100%; position: absolute; width: 100%; }';

export abstract class MapCanvasHandler implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  @Input() rows = 5;
  @Input() columns = 5;
  @Input() cellSize = 50;
  cWidth: number;
  cHeight: number;

  protected ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.cWidth = this.columns * this.cellSize;
    this.cHeight = this.rows * this.cellSize;
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setUp();
  }

  protected setUp() {}

  protected drawImage(x: number, y: number, src: string) {
    const img = new Image();
    img.onload = () => this.ctx.drawImage(img, x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    img.src = src;
  }

  protected clearCell({ x, y }) {
    this.ctx.clearRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  }

  protected clearCanvas() {
    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
  }
}
