import { TestBed, async, inject } from '@angular/core/testing';

import { LogisticGuard } from './logistic-guard'

describe('FinanceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogisticGuard]
    });
  });

  it('should ...', inject([LogisticGuard], (guard: LogisticGuard) => {
    expect(guard).toBeTruthy();
  }));
});
