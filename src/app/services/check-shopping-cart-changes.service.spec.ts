import { TestBed, inject } from '@angular/core/testing';

import { CheckShoppingCartChangesService } from './check-shopping-cart-changes.service';

describe('CheckShoppingCartChangesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckShoppingCartChangesService]
    });
  });

  it('should be created', inject([CheckShoppingCartChangesService], (service: CheckShoppingCartChangesService) => {
    expect(service).toBeTruthy();
  }));
});
