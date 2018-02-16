import {Component, OnChanges, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {NavigationExtras, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {Subscription} from 'rxjs/Subscription';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  private keyword: string;
  private loggedIn: boolean;
  private cartItemNumber: number;
  private cartUpdated: Subscription;
  private bookList: Book[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cartService: CartService,
    private bookService: BookService
  ) { }
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
    this.cartUpdated = this.cartService.CartItemCount
      .subscribe((count: number) => {
        this.cartItemNumber = count;
        console.log(this.cartItemNumber);
      });
  }
  logout() {
    this.loginService.logOut().subscribe(
      res => {
        console.log(res);
        location.reload();
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
        this.loggedIn = true;
      },
      error => {
        console.log(error);
        this.loggedIn = false;
      }
    );
  }

  getCartItemNumber() {
    this.cartService.getCartItemList().subscribe(
      res => {
        this.cartItemNumber = res.length;
      },
      error => {
        console.log(error.error);
      }
    );
  }
}
