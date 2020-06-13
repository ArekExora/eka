import { Injectable } from '@angular/core';
import {
  Cell, CellTypes,
  Character, CharActions, CharFacings, CharStatus,
  MINABLE_CELLS, Point,
  Resources
} from './definitions';
import { MapGeneratorService } from './map-generator.service';

export interface Command {
  charId: string;
  action: CharActions;
  facing: CharFacings;
}

@Injectable({
  providedIn: 'root'
})
export class GameMasterService {
  data = {
    mapInfo: [],
    charInfo: []
  };

  constructor(
    private mapGeneratorService: MapGeneratorService
  ) { }

  public initializeMap(mapName = 'map1') {
    this.data = this.mapGeneratorService.generateData();
    return this.makeDeepCopy(this.data);
  }

  // This commands should be already filtered (no more than one command for a given character, no orders to other player characters)
  public processCommands(commands: Command[]) {
    commands.forEach(({ charId, action, facing }) => {
      const { char, target } = this.getCharAndTarget(charId, facing);
      if (!char || !target) {
        return;
      }

      switch (action) {
        case CharActions.MOVE: return this.move(char, target);
        case CharActions.MINE: return this.mine(char, target, facing);
        case CharActions.DROP: return this.drop(char, target);
        default: console.error(`Invalid command action: '${action}'`);
      }
    });
    return this.makeDeepCopy(this.data);
  }

  private move(char: Character, target: Cell) {
    char.status = CharStatus.IDLE;
    char.facing = CharFacings.NONE;

    if (this.isCellFree(target)) {
      char.x = target.x;
      char.y = target.y;
    } else {
      console.log(`Unable to move '${char.id}' to '${target.x},${target.y}': Cell occupied!`);
    }
  }

  private mine(char: Character, target: Cell, facing: CharFacings) {
    char.status = CharStatus.MINING;
    char.facing = facing;

    if (MINABLE_CELLS.includes(target.type) && target.amount > 0) {
      console.log(`Successfully mined in ${target.type}!!`);
      // Get resource.
      const resource = this.getResourcesFromCellType(target.type);
      if (resource) {
        if (char.carrying) {
          console.log(`Character ${char.id} drops its load of ${char.carrying} to make space!`);
        }
        console.log(`Character ${char.id} takes one unit of ${resource}`);
        char.carrying = resource;

        // Reduce remaining amount.
        target.amount -= 1;
        if (target.amount < 1) {
          target.type = CellTypes.EMPTY;
          target.amount = 0;
        }
      }
    }
  }

  private drop(char: Character, target: Cell) {
    char.status = CharStatus.IDLE;
    char.facing = CharFacings.NONE;

    if (!char.carrying) {
      console.log(`Character ${char.id} has nothing to drop!`);
      return;
    }

    if (target.type === CellTypes.CASTLE && char.carrying === Resources.IRON) {
        target.amount += 1;
        console.log(`Successfully dropped iron in castle!!`);
    } else {
      console.log(`Resource ${char.carrying} dropped to the ground!`);
    }
    char.carrying = Resources.EMPTY;
  }

  private isCellFree(cell: Point) {
    const target = this.data.mapInfo.find(c => Point.equals(cell, c));
    const charInTarget = this.data.charInfo.find(c => Point.equals(cell, c));

    return target && !target.type && !charInTarget;
  }

  private getTargetPosition(origin: Point, dir: CharFacings): Point {
    const { x, y } = origin;
    switch (dir){
      case CharFacings.UP:    return { x, y: y - 1 };
      case CharFacings.DOWN:  return { x, y: y + 1 };
      case CharFacings.RIGHT: return { x: x + 1, y };
      case CharFacings.LEFT:  return { x: x - 1, y};
      default: console.error(`Invalid direction: '${dir}'`); return origin;
    }
  }

  private makeDeepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  private getResourcesFromCellType(type: CellTypes): Resources {
    const resources = {
      [CellTypes.EMPTY]:        Resources.EMPTY,
      [CellTypes.IRON_DEPOSIT]: Resources.IRON,
      [CellTypes.MOUNTAIN]:     Resources.STONE,
    };
    return resources[type] || Resources.EMPTY;
  }

  private getCharAndTarget(charId: string, facing: CharFacings) {
    const char: Character = this.data.charInfo.find(({ id }) => id === charId);

    if (!char) {
      console.error(`Unable to find character: '${charId}'`);
      return {};
    } else if (!Object.values(CharFacings).includes(facing)) {
      console.error(`Erroneous facing: '${facing}'`);
      return {};
    }

    const targetCoords = this.getTargetPosition(char, facing);
    const target = this.data.mapInfo.find(c => Point.equals(targetCoords, c));

    if (!target) {
      console.error(`Target cell is outside of the map, coordinates (${target.x},${target.y})`);
      return {};
    }

    return { char, target };
  }
}
