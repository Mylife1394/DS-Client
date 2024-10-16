import { TestBed } from '@angular/core/testing';

import { SensorLogService } from './sensor-log.service';

describe('SensorLogService', () => {
  let service: SensorLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
