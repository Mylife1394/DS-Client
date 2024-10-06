import { TestBed } from '@angular/core/testing';

import { PaginatorLocalizeService } from './paginator-localize.service';

describe('PaginatorLocalizeService', () => {
  let service: PaginatorLocalizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorLocalizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
