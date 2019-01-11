import { TestBed, inject } from '@angular/core/testing';

import { RestApisService } from './rest-apis.service';

describe('RestApisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestApisService]
    });
  });

  it('should be created', inject([RestApisService], (service: RestApisService) => {
    expect(service).toBeTruthy();
  }));
});
