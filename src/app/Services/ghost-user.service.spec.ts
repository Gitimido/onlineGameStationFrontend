import { TestBed } from '@angular/core/testing';

import { GhostUserService } from './ghost-user.service';

describe('GhostUserService', () => {
  let service: GhostUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhostUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
