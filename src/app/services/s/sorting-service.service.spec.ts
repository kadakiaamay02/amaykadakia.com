import { TestBed } from '@angular/core/testing';

import { SortingServiceService } from './sorting-service.service';

describe('SortingServiceService', () => {
  let service: SortingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
