import { TestBed } from '@angular/core/testing';

import { ProserviceService } from './proservice.service';

describe('ProserviceService', () => {
  let service: ProserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
