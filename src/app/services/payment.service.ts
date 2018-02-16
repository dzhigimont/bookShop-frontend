import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {UserPayment} from '../models/user-payment';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class PaymentService {
  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient
  ) { }
  newPayment(payment: UserPayment) {
    const url = this.serverPath + '/payment/add';
    return this.httpClient.post(url, JSON.stringify(payment));
  }

  getUserPaymentList(): Observable<any> {
    const url = this.serverPath + '/payment/getUserPaymentList';
    return this.httpClient.get(url);
  }

  removePayment(id: number) {
    const url = this.serverPath + '/payment/remove';
    return this.httpClient.post(url, id);
  }

  setDefaultPayment(id: number) {
    const url = this.serverPath + '/payment/setDefault';
    return this.httpClient.post(url, id);
  }
}
