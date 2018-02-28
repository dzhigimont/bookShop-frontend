import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {Book} from '../../models/book';
import {ShoppingCart} from '../../models/shopping-cart';
import {CartItem} from '../../models/cart-item';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {CheckSessionService} from '../../services/check-session.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  public serverPath = AppConst.serverPath;
  public selectedBook: Book;
  public cartItemList: CartItem[] = [];
  public cartItemNumber: number;
  public shoppingCart: ShoppingCart = new ShoppingCart();
  public cartItemUpdated: boolean;
  public emptyCart: boolean;
  public notEnoughStock: boolean;
  public dateFetched = false;
  public cartEmpty = false;
  constructor(
    private router: Router,
    private cartService: CartService,
    private checkSessionService: CheckSessionService,
    private loginService: LoginService
  ) { }

  onSelect(book: Book) {
    this.selectedBook = book;
    this.router.navigate(['/bookList', this.selectedBook.id]);
  }
  onRemoveCartItem(cartItem: CartItem) {
    this.cartService.removeCartItem(cartItem.id).subscribe(
      res => {
        console.log(res);
        this.getCartItemList();
        this.getShoppingCart();
      },
    error => {
       console.log(error.error);
    }
    );
  }
  onUpdateCartItem(cartItem: CartItem) {
    if (cartItem.qty > cartItem.book.inStockNumber) {
      this.notEnoughStock = true;
    } else {
      this.notEnoughStock = false;
      this.cartService.updateCartItem(cartItem.id, cartItem.qty).subscribe(
        res => {
          console.log(res);
          this.cartItemUpdated = true;
          this.getShoppingCart();
          setTimeout(() => {
            this.cartItemUpdated = false;
          }, 2000);
        },
        error => {
          console.log(error.error);
        }
      );
    }
  }
  ngOnInit() {
    this.getCartItemList();
    this.getShoppingCart();
    this.checkSession();
  }

  getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      res => {
       this.cartItemList = res;
       this.cartItemNumber = this.cartItemList.length;
        this.cartService.numberOfCartItem.next(this.cartItemNumber);
        this.dateFetched = true;
        if (this.cartItemNumber > 0) {
          this.cartEmpty = false;
        } else {
          this.cartEmpty = true;
        }
      },
      error => {
        console.log(error.error);
        this.dateFetched = false;
      }
    );
  }

  getShoppingCart() {
    this.cartService.getShoppingCart().subscribe(
      res => {
        this.shoppingCart = res;
      },
      error => {
        console.log(error.error);
      }
    );
  }
  onCheckOut() {
    if (this.cartItemNumber === 0) {
      this.emptyCart = true;
    } else {
      for (const item of this.cartItemList) {
        if (item.qty > item.book.inStockNumber) {
          console.log('not enough stock on some item');
          this.notEnoughStock = true;
          return;
        }
      }
      // this.router.navigate(['/order']);
    }
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
