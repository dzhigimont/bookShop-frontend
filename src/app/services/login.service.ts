import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class LoginService {
  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  sendCredential(username: string, password: string): Observable<any> {
    const url = this.serverPath + '/token';
    const encodedCredential =  btoa(username + ':' + password);
    const authorization = 'Basic ' + encodedCredential;
    const headers = new HttpHeaders({
      'Content-Type': 'x-www-form-urlencoded',
      'Authorization': authorization
    });
    return this.httpClient.get(url, { headers: headers});
  }

  checkSession() {
    const url = this.serverPath + '/checkSession';
    return this.httpClient.get(url);
  }
  logOut() {
    const url = this.serverPath + '/user/logout';
    console.log(url);
    localStorage.setItem('xAuthToken', 'null');
    return this.httpClient.post(url, ' ');
  }
}
