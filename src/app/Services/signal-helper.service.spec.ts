import { TestBed } from '@angular/core/testing';

import { SignalHelperService } from './signal-helper.service';

describe('SignalHelperService', () => {
  let service: SignalHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
