import { createAction } from '../../utils/reducer/reducer.utils';
import CART_ACTION_TYPES from './cart.types';

const addCartItem = (cartItems, productToAdd) => {
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

const removeCartItem = (cartItems, productToRemove) => {
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

const deleteCartItem = (cartItems, productToDelete) => {
  return cartItems.filter((item) => item.id !== productToDelete.id);
};

export const addItemToCart = (cartItems, productToAdd) => {
  const newCartItems = addCartItem(cartItems, productToAdd);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const removeItemFromCart = (cartItems, productToRemove) => {
  const newCartItems = removeCartItem(cartItems, productToRemove);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const deleteItemFromCart = (cartItems, productToDelete) => {
  const newCartItems = deleteCartItem(cartItems, productToDelete);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const setCartItems = (cartItems) =>
  createAction(CART_ACTION_TYPES.SET_CART_ITEMS, cartItems);

export const setIsCartOpen = (isCartOpen) =>
  createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, isCartOpen);

  export const clearCart = () => 
  createAction(CART_ACTION_TYPES.CLEAR_CART);