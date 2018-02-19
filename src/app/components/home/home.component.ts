import { Component, OnInit } from '@angular/core';
import {BookService} from '../../services/book.service';
import {AppConst} from '../../constants/app-const';
import {Book} from '../../models/book';
import { Router} from '@angular/router';
import index from '@angular/cli/lib/cli';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public selectedBook: Book;
  public bookList: Book[]= [];
  public fourRandomBooks: Book[]= [];
  public serverPath= AppConst.serverPath;
  private cartItemNumber: number;
  private cartItemList: CartItem[] = [];
  public dateFetched = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.bookService.getBookList().subscribe(
      res => {
        this.bookList = this.shuffle(res);
        for (let i = 0; i < 4; i++) {
          this.fourRandomBooks[i] = this.bookList[i];
        }
        this.dateFetched = true;
        console.log(this.bookList);
      },
      error => {
        console.log(error);
        this.dateFetched = false;
      }
    );
    this.getCartItemNumber();
  }

  onAddToCart(book: Book) {
    this.cartService.addItem(book.id, 1).subscribe(
      res => {
        console.log(res);
        if (this.isBookInCart(book)) {
          this.cartService.numberOfCartItem.next(this.cartItemNumber);
        }else {
          this.cartService.numberOfCartItem.next(this.cartItemNumber + 1);
        }
      },
      error => {
        console.log(error);
      }
    );
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
  isBookInCart(book: Book): boolean {
    for (const cartItem of this.cartItemList) {
      if (cartItem.book.id === book.id) {
        return true;
      }
    }
    return false;
  }

  onSelect(book: Book) {
    this.selectedBook = book;
    this.router.navigate(['/bookList', this.selectedBook.id]);
  }

  private shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
