import { TestBed } from '@angular/core/testing';

import { TargetGeneratorService } from './target-generator.service';

describe('TargetGeneratorService', () => {
  let service: TargetGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
