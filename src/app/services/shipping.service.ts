import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {UserPayment} from '../models/user-payment';
import {Observable} from 'rxjs/Observable';
import {UserShipping} from '../models/user-shipping';
@Injectable()
export class ShippingService {
  private serverPath = AppConst.serverPath;
  constructor(private httpClient: HttpClient) { }
  newShipping(shipping: UserShipping) {
    const url = this.serverPath + '/shipping/add';
    return this.httpClient.post(url, JSON.stringify(shipping));
  }

  getUserShippingList(): Observable<any> {
    const url = this.serverPath + '/shipping/getUserShippingList';
    return this.httpClient.get(url);
  }

  removeShipping(id: number) {
    const url = this.serverPath + '/shipping/remove';
    return this.httpClient.post(url, id);
  }

  setDefaultShipping(id: number) {
    const url = this.serverPath + '/shipping/setDefault';
    return this.httpClient.post(url, id);
  }

}
