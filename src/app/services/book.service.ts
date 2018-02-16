import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../constants/app-const';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BookService {
  private serverPath = AppConst.serverPath;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getBookList(): Observable<any> {
    const url = this.serverPath + '/book/bookList';
    return this.httpClient.get(url);
  }
  getBook(id: number): Observable<any> {
    const url = this.serverPath + '/book/' + id;
    return this.httpClient.get(url);
  }

  searchBook(keyword: string): Observable<any> {
    const url = this.serverPath + '/book/searchBook';
    return this.httpClient.post(url, keyword);
  }
}
