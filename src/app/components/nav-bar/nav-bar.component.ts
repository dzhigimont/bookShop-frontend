import {Component, OnChanges, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {NavigationExtras, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs/Subscription';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
import {CheckSessionService} from '../../services/check-session.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public keyword: string;
  public loggedIn: boolean;
  public cartItemNumber: number;
  public bookList: Book[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cartService: CartService,
    private bookService: BookService,
    private checkSessionService: CheckSessionService
  ) {
    this.checkSessionService.IsUserLoggedIn.subscribe( value => {
      this.loggedIn = value;
    });
    this.cartService.numberOfCartItem.subscribe( value => {
      this.cartItemNumber = value;
    });
  }
  onSearchByTitle() {
    this.bookService.searchBook(this.keyword).subscribe(
      res => {
        console.log(res);
        this.bookList = res;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'bookList': JSON.stringify(this.bookList)
          }
        };
        this.router.navigate(['/bookList'], navigationExtras);
      },
      error => {
        console.log(error);
      }
    );
  }
  ngOnInit() {
    this.checkSession();
    this.getCartItemNumber();
  }
  logout() {
    this.loginService.logOut().subscribe(
      res => {
        console.log(res);
        this.checkSessionService.IsUserLoggedIn.next(false);
        this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
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
      }
    );
  }

  getCartItemNumber() {
    this.cartService.getCartItemList().subscribe(
      res => {
        this.cartService.numberOfCartItem.next(res.length);
      },
      error => {
        console.log(error.error);
      }
    );
  }
}
