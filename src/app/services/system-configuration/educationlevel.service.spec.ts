import { TestBed } from '@angular/core/testing';

import { EducationlevelService } from './educationlevel.service';

describe('EducationlevelService', () => {
  let service: EducationlevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationlevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
