import { BrowserModule } from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatTabsModule, MatProgressSpinnerModule, MatIconModule, MatExpansionModule} from '@angular/material';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {routing} from './app.routing';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import {LoginService} from './services/login.service';
import {UserService} from './services/user.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import {PaymentService} from './services/payment.service';
import {ShippingService} from './services/shipping.service';
import { BookListComponent } from './components/book-list/book-list.component';
import {BookService} from './services/book.service';
import {DataFilterPipe} from './components/book-list/data-filter.pipe';
import {DataTableModule} from 'angular2-datatable';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import {CartService} from './services/cart.service';
import { OrderComponent } from './components/order/order.component';
import {OrderService} from './services/order.service';
import {CheckoutService} from './services/checkout.service';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    MyAccountComponent,
    MyProfileComponent,
    BookListComponent,
    DataFilterPipe,
    BookDetailComponent,
    ShoppingCartComponent,
    OrderComponent,
    OrderSummaryComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    DataTableModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule,
    MatTabsModule, MatIconModule, MatExpansionModule,
    HttpClientModule,
    routing,
  ],
  providers: [LoginService, UserService, PaymentService,
    ShippingService, BookService, CartService,
    OrderService, CheckoutService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
