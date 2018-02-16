import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Observable} from 'rxjs/Observable';
import {ShippingAddress} from '../models/shipping-address';
import {BillingAddress} from '../models/billing-address';
import {Payment} from '../models/payment';

@Injectable()
export class CheckoutService {

  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient
  ) { }

  checkout(shippingAddress: ShippingAddress, billingAddress: BillingAddress, payment: Payment, shippingMethod: string): Observable<any> {
    const url = this.serverPath + '/checkout/checkout';
    const order = {
      'shippingAddress': shippingAddress,
      'billingAddress': billingAddress,
      'payment': payment,
      'shippingMethod': shippingMethod
    }
    return this.httpClient.post(url, order);
  }

  getOrder() {
    const url = this.serverPath + '/checkout/getOrder';
    return this.httpClient.get(url);
  }
}
