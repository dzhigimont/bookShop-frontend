import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {UserService} from '../../services/user.service';
import {AppConst} from '../../constants/app-const';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  private serverPath = AppConst.serverPath;
  private emailPattern = AppConst.emailPattern;
  private usernamePattern = AppConst.usernamePattern;
  private  passwordPattern = AppConst. passwordPattern;
  private loginError = false;
  private loggedIn: boolean;
  private credential = {'username': '', 'password': ''};

  private emailSent = false;
  private usernameExist: boolean;
  private emailExist: boolean;
  private username: string;
  private email: string;
  private emailNotExist = false;
  private forgetPasswordEmailSent: boolean;
  private recoverEmail: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
  ) { }

  onLogin() {
    this.loginService.sendCredential(this.credential.username, this.credential.password).subscribe(
      res => {
        console.log(res);
        localStorage.setItem('xAuthToken', res.token );
        this.loggedIn = true;
        this.router.navigate(['/home']);
        location.reload();
      },
      error => {
        console.log(error);
        this.loggedIn = false;
        this.loginError = true;
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
  ngOnInit() {
    this.checkSession();
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

}
