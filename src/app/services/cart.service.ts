import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
@Injectable()
export class CartService {
  private serverPath = AppConst.serverPath;
  private prodCount = 0;
  prodCountCountChange: Subject<number> = new Subject<number>();
  public CartItemCount = this.prodCountCountChange.asObservable();
  constructor(
    private httpClient: HttpClient
  ) {}
  updateCount(count: number) {
    this.prodCount = count;
    this.prodCountCountChange.next(this.prodCount);
  }
  addItem(id: number, qty: number): Observable<any> {
    const url = this.serverPath + '/cart/add';
    const cartItemInfo = {
      'bookId': id,
      'qty': qty
    };
    return this.httpClient.post(url, cartItemInfo);
  }

  getCartItemList(): Observable<any> {
    const url = this.serverPath + '/cart/getCartItemList';
    return this.httpClient.get(url);
  }

  getShoppingCart(): Observable<any> {
    const url = this.serverPath + '/cart/getShoppingCart';
    return this.httpClient.get(url);
  }

  updateCartItem(cartItemId: number, qty: number): Observable<any> {
    const url = this.serverPath + '/cart/updateCartItem';
    const cartItemInfo = {
      'cartItemId': cartItemId,
      'qty': qty
    };
    return this.httpClient.post(url, cartItemInfo);
  }

  removeCartItem(id: number): Observable<any> {
    const url = this.serverPath + '/cart/removeItem';
    return this.httpClient.post(url, id);
  }
}
