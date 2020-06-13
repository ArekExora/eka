import { NgModule } from '@angular/core';
import { MapBackgroundComponent } from './map-background.component';
import { MapCharactersComponent } from './map-characters.component';
import { MapGridComponent } from './map-grid.component';
import { MapHighlightComponent } from './map-highlight.component';
import { MapComponent } from './map.component';


@NgModule({
  declarations: [
    MapComponent,
    MapBackgroundComponent,
    MapCharactersComponent,
    MapGridComponent,
    MapHighlightComponent
  ],
  imports: [],
  exports: [
    MapComponent
  ],
  providers: [],
  bootstrap: []
})
export class MapModule { }
