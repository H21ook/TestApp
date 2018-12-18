import { TestBed } from '@angular/core/testing';

import { FbaseService } from './fbase.service';

describe('FbaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FbaseService = TestBed.get(FbaseService);
    expect(service).toBeTruthy();
  });
});
