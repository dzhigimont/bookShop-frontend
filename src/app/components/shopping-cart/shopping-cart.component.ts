import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {Book} from '../../models/book';
import {ShoppingCart} from '../../models/shopping-cart';
import {CartItem} from '../../models/cart-item';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  private serverPath = AppConst.serverPath;
  private selectedBook: Book;
  private cartItemList: CartItem[] = [];
  private cartItemNumber: number;
  private shoppingCart: ShoppingCart = new ShoppingCart();
  public cartItemUpdated: boolean;
  private emptyCart: boolean;
  private notEnoughStock: boolean;
  constructor(
    private router: Router,
    private cartService: CartService,
  ) { }

  onSelect(book: Book) {
    this.selectedBook = book;
    this.router.navigate(['/bookDetail', this.selectedBook.id]);
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
    this.cartService.updateCartItem(cartItem.id, cartItem.qty).subscribe(
      res => {
        console.log(res);
        this.cartItemUpdated = true;
        this.getShoppingCart();
      },
      error => {
        console.log(error.error);
      }
    );
  }
  ngOnInit() {
    this.getCartItemList();
    this.getShoppingCart();
  }

  getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      res => {
       this.cartItemList = res;
       this.cartItemNumber = this.cartItemList.length;
        this.cartService.updateCount(this.cartItemNumber);
      },
      error => {
        console.log(error.error);
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
}
