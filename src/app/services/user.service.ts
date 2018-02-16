import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class UserService {
  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  newUser(username: string, email: string) {
    const url = this.serverPath + '/user/newUser';
    const userInfo = {
      username: username,
      email: email};
    return this.httpClient.post(url, JSON.stringify(userInfo));
  }
  retrievePassword(email: string) {
    const url = this.serverPath + '/user/forgetPassword';
    return this.httpClient.post(url, {email: email});
  }

  updateUserInfo(user: User, currentPassword: string, newPassword: string) {
    const url = this.serverPath + '/user/updateUserInfo';
    const userInfo = {
      'id': user.id,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'username': user.username,
      'currentPassword': currentPassword,
      'email': user.email,
      'newPassword': newPassword};
    return this.httpClient.post(url, JSON.stringify(userInfo));
  }

  getCurrentUser(): Observable<any> {
    const url = this.serverPath + '/user/getCurrentUser';
    return this.httpClient.get(url);
  }
}
