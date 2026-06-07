import { combineReducers } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  burgerConstructorReducer,
  userReducer,
  feedsReducer,
  ordersReducer
} from '../slices';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  feeds: feedsReducer,
  orders: ordersReducer
});

describe('rootReducer', () => {
  test('возвращает корректное начальное состояние при undefined + UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: { ingredients: [], loading: false, error: null },
      burgerConstructor: { bun: null, ingredients: [] },
      user: { user: null, isAuthChecked: false, loading: false, error: null },
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      orders: {
        orders: [],
        orderRequest: false,
        orderModalData: null,
        loading: false,
        error: null
      }
    });
  });
});
