import {Book} from './book';
import {ShoppingCart} from './shopping-cart';

export class CartItem {
  public id: number;
  public subtotal: number;
  public shoppingCart: ShoppingCart;
  public book: Book;
  public toUpdate: boolean;
  public qty: number;
}
