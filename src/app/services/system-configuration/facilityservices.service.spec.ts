import { TestBed } from '@angular/core/testing';

import { FacilityservicesService } from './facilityservices.service';

describe('FacilityservicesService', () => {
  let service: FacilityservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
