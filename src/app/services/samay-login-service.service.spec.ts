import { TestBed } from '@angular/core/testing';

import { SamayLoginServiceService } from './samay-login-service.service';

describe('SamayLoginServiceService', () => {
  let service: SamayLoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamayLoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
