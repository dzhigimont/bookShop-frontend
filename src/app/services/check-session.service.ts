import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
@Injectable()
export class CheckSessionService {
  public IsUserLoggedIn: Subject<boolean> = new Subject<boolean>();
  constructor( ) { }
}
