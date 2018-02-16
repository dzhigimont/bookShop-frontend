import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let xAuthToken: string;
    if (localStorage.getItem('xAuthToken') != null) {
      xAuthToken = localStorage.getItem('xAuthToken');
      } else {
      localStorage.setItem('xAuthToken', '000000000000000000000000000');
    }
    const newHeaders = req.headers.
                  append('x-auth-token', xAuthToken).
                      append('Content-Type', 'application/json');
    const clonedRequest = req.clone({headers: newHeaders});
    return next.handle(clonedRequest);
  }

  constructor() { }

}
