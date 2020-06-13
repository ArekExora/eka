import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Character } from '../definitions';
import { CANVAS_STYLE, CANVAS_TEMPLATE, MapCanvasHandler } from './map-canvas-handler';

@Component({
  selector: 'eka-map-chars',
  template: CANVAS_TEMPLATE,
  styles: [CANVAS_STYLE]
})
export class MapCharactersComponent extends MapCanvasHandler implements OnChanges {
  @Input() charInfo: Character[];

  protected setUp() {
    this.drawAllCharacters();
  }

  ngOnChanges({ charInfo }: SimpleChanges): void {
    if (!charInfo.previousValue) {
      return;
    }
    const { toDelete, toDraw } = this.getCharactersToUpdate(charInfo);
    toDelete.forEach(char => this.clearCell(char));
    toDraw.forEach(char => this.drawCharacter(char));
  }

  private getCharactersToUpdate({ previousValue, currentValue }) {
    const prevIds = previousValue.map(char => char.id);
    const currIds = currentValue.map(char => char.id);
    const allIds = [...new Set([...prevIds, ...currIds])];

    const remainIds = allIds.filter(id => prevIds.includes(id) && currIds.includes(id));
    const chgIds = previousValue
      .filter(char => Character.shouldRedraw(char, currentValue.find(({ id }) => id === char.id)))
      .map(({ id }) => id);
    const delIds = prevIds.filter(id => !currIds.includes(id));
    const addIds = currIds.filter(id => !prevIds.includes(id));

    return {
      toDelete: previousValue.filter(({ id }) => [...chgIds, ...delIds].includes(id)),
      toDraw: currentValue.filter(({ id }) => [...chgIds, ...addIds].includes(id))
    };
  }

  private drawAllCharacters() {
    if (!this.charInfo) {
      return;
    }

    this.clearCanvas();
    this.charInfo.forEach(char => this.drawCharacter(char));
  }

  private drawCharacter({ x, y, type, status, facing }: Character) {
    const icon = [type, status, facing].filter(str => !!str).join('-');
    this.drawImage(x, y, `/assets/icons/${icon}.png`);
  }
}
