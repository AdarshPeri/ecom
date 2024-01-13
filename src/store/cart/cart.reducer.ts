import { CartActions } from './cart.actions';
import { CART_ACTION_TYPES, CartItem } from './cart.types';

export type CartState = {
  readonly isCartOpen: boolean;
  readonly cartItems: CartItem[];
};

const CART_INITIAL_STATE: CartState = {
  isCartOpen: false,
  cartItems: [],
};

export const cartReducer = (
  state = CART_INITIAL_STATE,
  action = {} as CartActions
): CartState => {
  const { type } = action;
  switch (type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return { ...state, cartItems: action.payload };
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return { ...state, isCartOpen: action.payload };
    case CART_ACTION_TYPES.CLEAR_CART:
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};
