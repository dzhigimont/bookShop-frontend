import { Injectable } from '@angular/core';

@Injectable()
export class CheckShoppingCartChangesService {
  private shoppingCartUpdate: boolean;
  constructor() { }
  public SetShoppingCartUpdated() {
    this.shoppingCartUpdate = true;
  }

  public SetShoppingCartUnUpdated() {
    this.shoppingCartUpdate = false;
  }

}
