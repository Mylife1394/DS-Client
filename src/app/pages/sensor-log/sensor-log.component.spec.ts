import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorLogComponent } from './sensor-log.component';

describe('SensorLogComponent', () => {
  let component: SensorLogComponent;
  let fixture: ComponentFixture<SensorLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
