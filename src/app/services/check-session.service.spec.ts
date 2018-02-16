import { TestBed, inject } from '@angular/core/testing';

import { CheckSessionService } from './check-session.service';

describe('CheckSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckSessionService]
    });
  });

  it('should be created', inject([CheckSessionService], (service: CheckSessionService) => {
    expect(service).toBeTruthy();
  }));
});
