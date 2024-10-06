import { TestBed } from '@angular/core/testing';

import { LocalizationStringService } from './localization-string.service';

describe('LocalizationStringService', () => {
  let service: LocalizationStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizationStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
