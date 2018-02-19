import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {PaymentService} from '../../services/payment.service';
import {UserPayment} from '../../models/user-payment';
import {UserBilling} from '../../models/user-billing';
import {NgForm} from '@angular/forms';
import {UserShipping} from '../../models/user-shipping';
import {ShippingService} from '../../services/shipping.service';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {CheckSessionService} from '../../services/check-session.service';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  public serverPath = AppConst.serverPath;
  public dateFetched = false;
  public loginError: boolean;
  public loggedIn: boolean;
  public credential = {'username': '', 'password': ''}
  public user: User = new User();
  public updateSuccess: boolean;
  public newPassword: string;
  public currentPassword: string;
  public incorrectPassword: boolean;

  public selectedBillingTab = 0;
  public selectedProfileTab = 0;
  public selectedShippingTab = 0;

  public userPayment = new UserPayment();
  public userBilling = new UserBilling();
  public userPaymentList: UserPayment[] = [];
  public defaultPaymentSet: boolean;
  public defaultUserPaymentId: number;
  public stateList: string[] = [];
  public addNewPaymentSuccess: boolean;
  public userShipping: UserShipping = new UserShipping();
  public userShippingList: UserShipping[] = [];
  public defaultUserShippingId: number;
  public defaultShippingSet: boolean;
  public addNewShippingSuccess: boolean;

  public orderList: Order[] = [];
  public order: Order = new Order();
  public displayOrderDetail: boolean;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private orderService: OrderService,
    private checkSessionService: CheckSessionService
  ) { }

  ngOnInit() {
    this.checkSession();
    this.getCurrentUser();
    this.getOrderList();
    for (const s in AppConst.usStates) {
      this.stateList.push(s);
    }
    this.userBilling.userBillingState = '';
    this.userPayment.type = '';
    this.userPayment.expiryMonth = '';
    this.userPayment.expiryYear = '';
    this.userPayment.userBilling = this.userBilling;
    this.defaultPaymentSet = false;
    this.addNewPaymentSuccess = false;
  }
  selectedBillingChange(val: number) {
    this.selectedBillingTab = val;
  }
  selectedShippingChange(val: number) {
    this.selectedShippingTab = val;
  }
  onUpdateUserInfo() {
    this.userService.updateUserInfo(this.user, this.currentPassword, this.newPassword).subscribe(
      res => {
       console.log(res);
       this.updateSuccess = true;
        this.incorrectPassword = false;
      },
      error => {
        console.log(error);
        if (error.error === 'Incorrect current password!' || error.error === 'Empty current password!') {
          this.incorrectPassword = true;
          this.updateSuccess = false;
        }
      }
    );
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
  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(
      res => {
        this.user = res;
        this.dateFetched = true;
        this.userPaymentList = this.user.userPaymentList;
        for (const index in this.userPaymentList) {
          if (this.userPaymentList[index].defaultPayment) {
            this.defaultUserPaymentId = this.userPaymentList[index].id;
            break;
          }
        }
        this.userShippingList = this.user.userShippingList;
        if (this.userShippingList.length !== 0) {
          for (const index in this.userPaymentList) {
            if (this.userShippingList[index].userShippingDefault) {
              this.defaultUserShippingId = this.userShippingList[index].id;
              break;
            }
          }
        }
      },
      error => {
        console.log(error)
        this.dateFetched = false;
      }
    );
  }
  getOrderList() {
    this.orderService.getOrderList().subscribe(
      res => {
        this.orderList = res;
      },
      error => {
        console.log(error);
      }
    );
  }
  onDisplayOrder(order: Order) {
    console.log(order);
    this.order = order;
    this.displayOrderDetail = true;
  }
  onNewShipping(form: NgForm) {
    this.shippingService.newShipping(this.userShipping).subscribe(
      res => {
        this.addNewShippingSuccess = true;
        this.getCurrentUser();
        this.selectedShippingTab = 0;
        form.resetForm();
        setTimeout(() => {
          this.addNewShippingSuccess = false;
        }, 2000);
      },
      error => {
        this.addNewShippingSuccess = false;
          console.log(error.error);
      }
    );
  }

  onNewPayment(form: NgForm) {
    this.paymentService.newPayment(this.userPayment).subscribe(
      res => {
        this.addNewPaymentSuccess = true;
        this.getCurrentUser();
        this.selectedBillingTab = 0;
        form.resetForm();
        setTimeout(() => {
          this.addNewPaymentSuccess = false;
        }, 2000);
      },
      error => {
        this.addNewPaymentSuccess = false;
        console.log(error.error);
      }
    );
  }

  onUpdateShipping(shipping: UserShipping) {
    this.userShipping = shipping;
    this.selectedShippingTab = 1;
  }
  onUpdatePayment(payment: UserPayment) {
    this.userPayment = payment;
    this.userBilling = payment.userBilling;
    this.selectedBillingTab = 1;
  }
  onCancelUpdatePayment(form: NgForm) {
    form.resetForm();
    this.getCurrentUser();
    this.selectedBillingTab = 0;
  }
  onCancelUpdateShipping(form: NgForm) {
    form.resetForm();
    this.getCurrentUser();
    this.selectedShippingTab = 0;
  }

  onRemovePayment(id: number) {
    this.paymentService.removePayment(id).subscribe(
      res => {
        this.getCurrentUser();
      },
      error => {
        console.log(error.error);
      }
    );
  }
  onRemoveShipping(id: number) {
    this.shippingService.removeShipping(id).subscribe(
      res => {
        this.getCurrentUser();
      },
      error => {
        console.log(error.error);
      }
    );
  }

  setDefaultPayment() {
    this.defaultPaymentSet = false;
    this.paymentService.setDefaultPayment(this.defaultUserPaymentId).subscribe(
      res => {
        this.getCurrentUser();
        this.defaultPaymentSet = true;
        setTimeout(() => {
          this.defaultPaymentSet = false;
        }, 2000);
      },
      error => {
        console.log(error.error);
      }
    );
  }

  setDefaultShipping() {
    this.defaultShippingSet = false;
    this.shippingService.setDefaultShipping(this.defaultUserShippingId).subscribe(
      res => {
        this.getCurrentUser();
        this.defaultShippingSet = true;
        setTimeout(() => {
          this.defaultShippingSet = false;
        }, 2000);
      },
      error => {
        console.log(error.error);
      }
    );
  }


}
