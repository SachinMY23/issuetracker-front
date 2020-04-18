import { TestBed } from '@angular/core/testing';

import { IssueSocketService } from './issue-socket.service';

describe('IssueSocketService', () => {
  let service: IssueSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
