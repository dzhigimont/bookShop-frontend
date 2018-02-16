import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Observable} from 'rxjs/Observable';
import {Order} from '../models/order';
@Injectable()
export class OrderService {
  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient
  ) { }

  getOrderList(): Observable<any> {
    const url = this.serverPath + '/order/getOrderList';
    return this.httpClient.get(url);
  }

}
