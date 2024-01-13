import {
  Action,
  ActionWithPayload,
  createAction,
} from '../../utils/reducer/reducer.utils';
import { CategoryItem } from '../categories/categories.types';
import { CART_ACTION_TYPES, CartItem } from './cart.types';

const addCartItem = (
  cartItems: CartItem[],
  productToAdd: CategoryItem
): CartItem[] => {
  let isItemPresent = false;
  cartItems = cartItems.map((item) => {
    if (item.id === productToAdd.id) {
      item.quantity += 1;
      isItemPresent = true;
    }
    return item;
  });
  return isItemPresent
    ? cartItems
    : [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (
  cartItems: CartItem[],
  productToRemove: CartItem
): CartItem[] => {
  let itemToDelete = null;
  cartItems = cartItems.map((item) => {
    if (item.id === productToRemove.id) {
      item.quantity -= 1;
      if (item.quantity === 0) itemToDelete = item;
    }
    return item;
  });
  return itemToDelete ? deleteCartItem(cartItems, itemToDelete) : cartItems;
};

const deleteCartItem = (
  cartItems: CartItem[],
  productToDelete: CartItem
): CartItem[] => {
  return cartItems.filter((item) => item.id !== productToDelete.id);
};

export const addItemToCart = (
  cartItems: CartItem[],
  productToAdd: CategoryItem
) => {
  const newCartItems = addCartItem(cartItems, productToAdd);
  return setCartItems(newCartItems);
};

export const removeItemFromCart = (
  cartItems: CartItem[],
  productToRemove: CartItem
) => {
  const newCartItems = removeCartItem(cartItems, productToRemove);
  return setCartItems(newCartItems);
};

export const deleteItemFromCart = (
  cartItems: CartItem[],
  productToDelete: CartItem
) => {
  const newCartItems = deleteCartItem(cartItems, productToDelete);
  return setCartItems(newCartItems);
};

export const setCartItems = (cartItems: CartItem[]): SetCartItems =>
  createAction(CART_ACTION_TYPES.SET_CART_ITEMS, cartItems);

export const setIsCartOpen = (isCartOpen: boolean): SetIsCartOpen =>
  createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, isCartOpen);

export const clearCart = (): ClearCart => createAction(CART_ACTION_TYPES.CLEAR_CART);

export type SetIsCartOpen = ActionWithPayload<
  CART_ACTION_TYPES.SET_IS_CART_OPEN,
  boolean
>;
export type SetCartItems = ActionWithPayload<
  CART_ACTION_TYPES.SET_CART_ITEMS,
  CartItem[]
>;

export type ClearCart = Action<CART_ACTION_TYPES.CLEAR_CART>

export type CartActions = SetIsCartOpen | SetCartItems | ClearCart;
