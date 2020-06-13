import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapHolderComponent } from './map-holder.component';


describe('MapComponent', () => {
  let component: MapHolderComponent;
  let fixture: ComponentFixture<MapHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
