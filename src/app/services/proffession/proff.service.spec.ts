import { TestBed } from '@angular/core/testing';

import { ProffService } from './proff.service';

describe('ProffService', () => {
  let service: ProffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
