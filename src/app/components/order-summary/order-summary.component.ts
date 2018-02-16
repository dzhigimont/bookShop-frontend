import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {CheckoutService} from '../../services/checkout.service'
import {Order} from '../../models/order';
import {CartItem} from '../../models/cart-item';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  public serverPath = AppConst.serverPath;
  public  order: Order = new Order();
  public estimatedDeliveryDate: string;
  public cartItemList: CartItem[]= [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.order = JSON.parse(params['order']);
      const deliveryDate = new Date();
      if (this.order.shoppingMethod === 'groundShipping') {
        deliveryDate.setDate(deliveryDate.getDate() + 5);
      }else {
        deliveryDate.setDate(deliveryDate.getDate() + 3);
      }
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      this.estimatedDeliveryDate = days[deliveryDate.getDay()] + ', ' +
        deliveryDate.getFullYear() + '/' + deliveryDate.getMonth() + '/' + deliveryDate.getDate();
      this.cartItemList = this.order.cartItemList;
    });
  }

}
