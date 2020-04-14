import { TestBed } from '@angular/core/testing';

import { ProudctService } from './proudct.service';

describe('ProudctService', () => {
  let service: ProudctService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProudctService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
