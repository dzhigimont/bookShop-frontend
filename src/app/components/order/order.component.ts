import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {Book} from '../../models/book';
import {UserShipping} from '../../models/user-shipping';
import {UserPayment} from '../../models/user-payment';
import {ShoppingCart} from '../../models/shopping-cart';
import {CartService} from '../../services/cart.service';
import {ShippingService} from '../../services/shipping.service';
import {PaymentService} from '../../services/payment.service';
import {CheckoutService} from '../../services/checkout.service';
import {AppConst} from '../../constants/app-const';
import {CartItem} from '../../models/cart-item';
import {Order} from '../../models/order';
import {UserBilling} from '../../models/user-billing';
import {ShippingAddress} from '../../models/shipping-address';
import {BillingAddress} from '../../models/billing-address';
import {Payment} from '../../models/payment';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public serverPath = AppConst.serverPath;
  public selectedBook: Book;
  public userShipping: UserShipping = new UserShipping();
  public userPayment: UserPayment = new UserPayment();
  public userBilling: UserBilling = new UserBilling();
  public shoppingCart: ShoppingCart = new ShoppingCart();
  public shippingAddress: ShippingAddress = new ShippingAddress();
  public billingAddress: BillingAddress = new BillingAddress();
  public payment: Payment = new Payment();

  public cartItemList: CartItem[] = [];
  public cartItemNumber: number;
  public userShippingList: UserShipping[] = [];
  public emptyShippingList: boolean;
  public userPaymentList: UserPayment[] = [];
  public emptyPaymentList: boolean;
  public stateList: string[]= [];
  public selectedTab: number;
  public shippingMethod: string;
  public order: Order= new Order();
  public missingRequaredField: boolean;
  public cartEmpty = false;
  private dateFetched= false;

  constructor(
    private router: Router,
    private  cartService: CartService,
    private shippingService: ShippingService,
    private paymentService: PaymentService,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    for (const s in AppConst.usStates) {
      this.stateList.push(s);
    }
    this.getShoppingCart();
    this.getUserShippingList();
    this.getUserPaymentList();
    this.getUserCartItemList();
    this.shippingMethod = 'groundShipping';
  }
  onSelectedBook(book: Book) {
    this.selectedBook = book;
    this.router.navigate(['/bookList/book', this.selectedBook.id]);
  }
  selectedChange(val: number) {
    this.selectedTab = val;
  }
  goToPayment() {
    this.selectedTab = 1;
  }
  goToReview() {
    this.selectedTab = 2;
  }
  setShippingAddress(userShipping: UserShipping) {
    this.shippingAddress.shippingAddressName = userShipping.userShippingName;
    this.shippingAddress.shippingAddressStreet1 = userShipping.userShippingStreet1;
    this.shippingAddress.shippingAddressStreet2 = userShipping.userShippingStreet2;
    this.shippingAddress.shippingAddressCity = userShipping.userShippingCity;
    this.shippingAddress.shippingAddressState = userShipping.userShippingState;
    this.shippingAddress.shippingAddressCountry = userShipping.userShippingCountry;
    this.shippingAddress.shippingAddressZipcode = userShipping.userShippingZipcode;
  }

  setPaymentMethod(userPayment: UserPayment) {
    this.payment.type = userPayment.type;
    this.payment.cardNumber = userPayment.cardNumber;
    this.payment.expiryMonth = userPayment.expiryMonth;
    this.payment.expiryYear = userPayment.expiryYear;
    this.payment.cvc = userPayment.cvc;
    this.payment.holderName = userPayment.holderName;
    this.payment.defaultPayment = userPayment.defaultPayment;
    this.billingAddress.billingAddressName = userPayment.userBilling.userBillingName;
    this.billingAddress.billingAddressStreet1 = userPayment.userBilling.userBillingStreet1;
    this.billingAddress.billingAddressStreet2 = userPayment.userBilling.userBillingStreet2;
    this.billingAddress.billingAddressCity = userPayment.userBilling.userBillingCity;
    this.billingAddress.billingAddressState = userPayment.userBilling.userBillingState;
    this.billingAddress.billingAddressCountry = userPayment.userBilling.userBillingCountry;
    this.billingAddress.billingAddressZipcode = userPayment.userBilling.userBillingZipcode;
  }

  setBillingAsShipping(checked: boolean) {
    console.log('same as shipping')
    if (checked) {
      this.billingAddress.billingAddressName = this.shippingAddress.shippingAddressName;
      this.billingAddress.billingAddressStreet1 = this.shippingAddress.shippingAddressStreet1;
      this.billingAddress.billingAddressStreet2 = this.shippingAddress.shippingAddressStreet2;
      this.billingAddress.billingAddressCity = this.shippingAddress.shippingAddressCity;
      this.billingAddress.billingAddressState = this.shippingAddress.shippingAddressState;
      this.billingAddress.billingAddressCountry = this.shippingAddress.shippingAddressCountry;
      this.billingAddress.billingAddressZipcode = this.shippingAddress.shippingAddressZipcode;
    } else {
      this.billingAddress.billingAddressName = '';
      this.billingAddress.billingAddressStreet1 = '';
      this.billingAddress.billingAddressStreet2 = '';
      this.billingAddress.billingAddressCity = '';
      this.billingAddress.billingAddressState = '';
      this.billingAddress.billingAddressCountry = '';
      this.billingAddress.billingAddressZipcode = '';
    }
  }
  onSubmit() {
    this.checkoutService.checkout(this.shippingAddress, this.billingAddress, this.payment, this.shippingMethod).subscribe(
      res => {
        this.order = res;
        console.log(this.order);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'order': JSON.stringify(this.order)
          }
        };
        this.router.navigate(['/shoppingCart/orderSummary'], navigationExtras);
      },
      error => {
        console.log(error);
      }
    );
  }
  getShoppingCart() {
    this.cartService.getShoppingCart().subscribe(
      res => {
        this.shoppingCart = res;
        },
      error => {
        console.log(error);
      }
      );
  }
  getUserShippingList() {
    this.shippingService.getUserShippingList().subscribe(
      res => {
        this.userShippingList = res;
        for (const userShipping of this.userShippingList) {
          if (userShipping.userShippingDefault) {
            this.setShippingAddress(userShipping);
            break;
          }
        }
        if (this.userShippingList.length === 0) {
          this.emptyShippingList = false;
        }else {
          this.emptyShippingList = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  getUserPaymentList() {
    this.paymentService.getUserPaymentList().subscribe(
      res => {
        this.userPaymentList = res;
        for (const userPayment of this.userPaymentList) {
          if (userPayment.defaultPayment) {
           this.setPaymentMethod(userPayment);
            break;
          }
        }
        if (this.userPaymentList.length === 0) {
          this.emptyPaymentList = false;
        }else {
          this.emptyPaymentList = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  getUserCartItemList() {
    this.cartService.getCartItemList().subscribe(
      res => {
        this.cartItemList = res;
        this.cartItemNumber = this.cartItemList.length;
        if (this.cartItemNumber > 0) {
          this.cartEmpty = false;
        } else {
          this.cartEmpty = true;
        }
        this.dateFetched = true;
      },
      error => {
        this.dateFetched = false;
        console.log(error);
      }
    );
  }
}
