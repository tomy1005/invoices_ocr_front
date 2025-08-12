import { TestBed } from '@angular/core/testing';

import { MistralApiService } from './mistral-api.service';

describe('MistralApiService', () => {
  let service: MistralApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MistralApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
