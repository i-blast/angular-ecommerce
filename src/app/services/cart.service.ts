import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    const cartItemsStr = this.storage.getItem('cartItems');
    if (!!cartItemsStr) {
      this.cartItems = JSON.parse(cartItemsStr);
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    let existingCartItem: CartItem | undefined = this.cartItems.find(
      (item) => item.id === theCartItem.id
    );

    if (!!existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (item) => cartItem.id === item.id
    );

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    this.cartItems.forEach((item) => {
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValue += item.quantity;
    });

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    this.cartItems.forEach((item) => {
      const subTotalPrice: number = item.quantity * item.unitPrice;
      console.log(
        `name=${item.name}, quantity=${item.quantity}, unitPrice=${item.unitPrice}, subTotalPrice=${subTotalPrice}`
      );
    });

    console.log(
      `totalPrice=${totalPriceValue.toFixed(
        2
      )}, totalQuantity=${totalQuantityValue}`
    );
    console.log('-----');
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
