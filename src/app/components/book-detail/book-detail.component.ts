import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/book';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../../constants/app-const';
import {BookService} from '../../services/book.service';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  private bookId: number;
  private book: Book = new Book();
  private serverPath = AppConst.serverPath;
  private numberList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private qty: number;
  private addBookSuccess= false;
  private notEnoughStock= false;
  private cartItemNumber: number;
  private cartItemList: CartItem[] = [];
  constructor(
    private bookService: BookService,
    private router: Router,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) { }
  onAddToCart() {
    this.cartService.addItem(this.bookId, this.qty).subscribe(
      res => {
       console.log(res);
       this.addBookSuccess = true;
       if (this.isBookInCart()) {
         this.cartService.updateCount(this.cartItemNumber );
       }else {
         this.cartService.updateCount(this.cartItemNumber + 1);
       }
      },
      error => {
        console.log(error);
        this.notEnoughStock = true;
      }
    );
  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.bookId = Number.parseInt(params['id']);
    });
    this.bookService.getBook(this.bookId).subscribe(
      res => {
        this.book = res;
    },
      error => {
       console.log(error);
      }
    );
    this.qty = 1;
   this.getCartItemNumber();
  }

  getCartItemNumber() {
    this.cartService.getCartItemList().subscribe(
      res => {
        this.cartItemList = res;
        this.cartItemNumber = res.length;
      },
      error => {
        console.log(error.error);
      }
    );
  }
  isBookInCart(): boolean {
    for (const cartItem of this.cartItemList) {
      if (cartItem.book.id === this.bookId) {
        return true;
      }
    }
    return false;
  }

}