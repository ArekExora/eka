import { Injectable } from '@angular/core';
import { CellTypes, CharTypes } from './definitions';

@Injectable({
  providedIn: 'root'
})
export class MapGeneratorService {
  private maps = {
    map1: {
      columns: 10,
      rows: 10,
      mapData: {
        ['0,5']: CellTypes.CASTLE,
        ['1,0']: CellTypes.IRON_DEPOSIT,
        ['2,2']: CellTypes.MOUNTAIN,
        ['5,5']: CellTypes.IRON_DEPOSIT,
        ['6,5']: CellTypes.MOUNTAIN,
        ['8,4']: CellTypes.IRON_DEPOSIT,
        ['9,8']: CellTypes.MOUNTAIN
      },
      characters: [
        { x: 3, y: 3, type: CharTypes.PAWN, id: 'pawn1' },
        { x: 2, y: 1, type: CharTypes.PAWN, id: 'pawn2' },
        { x: 6, y: 6, type: CharTypes.PAWN, id: 'pawn3' }
      ]
    }
  };

  constructor() { }

  public generateData(mapName = 'map1') {
    const map = this.maps[mapName];
    if (!map) {
      return { mapInfo: [], charInfo: [] };
    }
    return {
      mapInfo: this.generateMapInfo(map),
      charInfo: this.generateCharacters(map)
    };
  }

  private generateCharacters({ characters }) {
    // TODO: Add some actual logic.
    return characters;
  }

  private generateMapInfo({ mapData, columns, rows }) {
    const mapInfo = [];

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        mapInfo.push(this.generateCell(x, y, mapData[`${x},${y}`] || CellTypes.EMPTY));
      }
    }

    return mapInfo;
  }

  private generateCell(x: number, y: number, type: CellTypes) {
    const defaultAmounts = {
      [CellTypes.EMPTY]: 0,
      [CellTypes.CASTLE]: 0,
      [CellTypes.IRON_DEPOSIT]: 1,
      [CellTypes.MOUNTAIN]: 5,
    };

    return {
      x, y, type, amount: defaultAmounts[type]
    };
  }
}
