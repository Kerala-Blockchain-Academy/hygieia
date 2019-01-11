import { TestBed } from '@angular/core/testing';

import { SawtoothService } from './sawtooth.service';

describe('SawtoothService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SawtoothService = TestBed.get(SawtoothService);
    expect(service).toBeTruthy();
  });
});