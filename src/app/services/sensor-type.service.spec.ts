import { TestBed } from '@angular/core/testing';

import { SensorTypeService } from './sensor-type.service';

describe('SensorTypeService', () => {
  let service: SensorTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
