import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {Router, ActivatedRoute} from '@angular/router';
import {Order} from '../../models/order';
import {CartItem} from '../../models/cart-item';
import {CheckSessionService} from '../../services/check-session.service';
import {LoginService} from '../../services/login.service';

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
    private checkSessionService: CheckSessionService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.checkSession();
    this.route.queryParams.subscribe(params => {
      if (params['order'] !== undefined ) {
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
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
  checkSession() {
    this.loginService.checkSession().subscribe(
      res => {
        console.log(res);
        this.checkSessionService.IsUserLoggedIn.next(true);
      },
      error => {
        console.log(error);
        this.checkSessionService.IsUserLoggedIn.next(false);
        this.router.navigate(['/myAccount']);
      }
    );
  }

}
