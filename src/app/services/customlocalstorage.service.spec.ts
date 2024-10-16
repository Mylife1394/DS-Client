import { TestBed } from '@angular/core/testing';

import { CustomlocalstorageService } from './customlocalstorage.service';

describe('CustomlocalstorageService', () => {
  let service: CustomlocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomlocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
