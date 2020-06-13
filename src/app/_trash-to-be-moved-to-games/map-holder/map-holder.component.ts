import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CellTypes, CharActions, Point } from '../definitions';
import { GameMasterService } from '../game-master.service';

@Component({
  selector: 'eka-map-holder',
  templateUrl: './map-holder.component.html'
})
export class MapHolderComponent implements OnInit {
  data = {
    mapInfo: [],
    charInfo: {}
  };
  ironInBase = 0;
  displayMap = false;

  constructor(
    private gameMasterService: GameMasterService,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.displayMap = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.processData(this.gameMasterService.initializeMap());
  }

  onHover(point: Point) {

  }

  moveChar(charId: string, facing: any): void {
    this.processData(this.gameMasterService.processCommands([
      { charId, action: CharActions.MOVE, facing }
    ]));
  }

  mineChar(charId: string, facing: any): void {
    this.processData(this.gameMasterService.processCommands([
      { charId, action: CharActions.MINE, facing }
    ]));
  }

  dropChar(charId: string, facing: any): void {
    this.processData(this.gameMasterService.processCommands([
      { charId, action: CharActions.DROP, facing }
    ]));
  }

  private processData(data) {
    this.data = data;
    const playerBase = data.mapInfo.find(({ type }) => type === CellTypes.CASTLE) || { amount: 0 };
    this.ironInBase = playerBase.amount;
  }
}
