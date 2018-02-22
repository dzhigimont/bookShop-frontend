import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/user.service';
import {AppConst} from '../../constants/app-const';
import {CheckSessionService} from '../../services/check-session.service';
import {CartService} from '../../services/cart.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  public serverPath = AppConst.serverPath;
  public emailPattern = AppConst.emailPattern;
  public usernamePattern = AppConst.usernamePattern;
  public  passwordPattern = AppConst. passwordPattern;
  public loginError = false;
  public credential = {'username': '', 'password': ''};

  public emailSent = false;
  public usernameExist: boolean;
  public emailExist: boolean;
  public username: string;
  public email: string;
  public emailNotExist = false;
  public forgetPasswordEmailSent: boolean;
  public recoverEmail: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private checkSessionService: CheckSessionService,
    private cartService: CartService,
    private location: Location
  ) { }

  onLogin() {
    this.loginService.sendCredential(this.credential.username, this.credential.password).subscribe(
      res => {
        console.log(res);
        localStorage.setItem('xAuthToken', res.token );
        this.checkSessionService.IsUserLoggedIn.next(true);
        this.getCartItemNumber();
        // this.router.navigate(['/home']);
        this.location.back();
      },
      error => {
        console.log(error);
        this.checkSessionService.IsUserLoggedIn.next(false);
        this.loginError = true;
        this.router.navigate(['/myAccount']);
      }
    );
  }
  onNewAccount() {
    this.usernameExist = false;
    this.emailExist = false;
    this.emailSent = false;
    this.userService.newUser(this.username, this.email).subscribe(
      res => {
        console.log(res);
        this.emailSent = true;
      },
      error => {
        switch (error.error) {
          case 'usernameExist': {
            this.usernameExist = true;
            break;
          }
          case 'emailExists': {
            this.emailExist = true;
            break;
          }
        }
      }
    );
  }
  onForgetPassword() {
    this.forgetPasswordEmailSent = false;
    this.emailNotExist = false;
    this.userService.retrievePassword(this.recoverEmail).subscribe(
      res => {
        console.log(res);
        this.forgetPasswordEmailSent = true;
      },
      error => {
        console.log(error.text());
        switch (error.text()) {
          case 'emailNotExist': {
            this.emailNotExist = true;
            break;
          }
        }
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
  ngOnInit() {
  }


}
