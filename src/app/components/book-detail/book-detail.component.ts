import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/book';
import {Params, ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../../constants/app-const';
import {BookService} from '../../services/book.service';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';
import {CheckSessionService} from '../../services/check-session.service';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  public bookId: number;
  public book: Book = new Book();
  public serverPath = AppConst.serverPath;
  public numberList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public qty: number;
  public addBookSuccess= false;
  public notEnoughStock= false;
  public cartItemNumber: number;
  public cartItemList: CartItem[] = [];
  public dateFetched = false;
  public loggedIn: boolean;
  constructor(
    private loginService: LoginService,
    private bookService: BookService,
    private router: Router,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private cartService: CartService,
    private checkSessionService: CheckSessionService
  ) {
    this.checkSessionService.IsUserLoggedIn.subscribe( value => {
      this.loggedIn = value;
    });
  }
  onAddToCart() {
    console.log(this.loggedIn);
    if (this.loggedIn) {
      this.cartService.addItem(this.bookId, this.qty).subscribe(
        res => {
         console.log(res);
         this.addBookSuccess = true;
         if (this.isBookInCart()) {
           this.cartService.numberOfCartItem.next(this.cartItemNumber);
         }else {
           this.cartService.numberOfCartItem.next(this.cartItemNumber + 1);
         }
        },
        error => {
          console.log(error);
          this.notEnoughStock = true;
        }
      );
    }else {
      this.router.navigate(['/myAccount']);
    }
  }
  ngOnInit() {
    this.checkSession();
    this.getCartItemNumber();
    this.route.params.forEach((params: Params) => {
      this.bookId = Number.parseInt(params['id']);
    });
    this.bookService.getBook(this.bookId).subscribe(
      res => {
        this.book = res;
        this.dateFetched = true;
    },
      error => {
       console.log(error);
        this.dateFetched = false;
      }
    );
    this.qty = 1;

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
  checkSession() {
    this.loginService.checkSession().subscribe(
      res => {
        console.log(res);
        this.checkSessionService.IsUserLoggedIn.next(true);
      },
      error => {
        console.log(error);
        this.checkSessionService.IsUserLoggedIn.next(false);
      }
    );
  }



}
