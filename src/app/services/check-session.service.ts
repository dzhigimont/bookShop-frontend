import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {LoginService} from './login.service';
@Injectable()
export class CheckSessionService {
  private sessionActive: boolean;
  sessionActiveChange: Subject<boolean> = new Subject<boolean>();
  public sessionActiveEvent = this.sessionActiveChange.asObservable();
  constructor(
   private loginService: LoginService
  ) { }
  checkSession() {
    this.loginService.checkSession().subscribe(
      res => {
        console.log(res);
        this.sessionActive = true;
        this.sessionActiveChange.next(this.sessionActive);
      },
      error => {
        console.log(error);
        this.sessionActive = false;
        this.sessionActiveChange.next(this.sessionActive);
      }
    );
  }
}
