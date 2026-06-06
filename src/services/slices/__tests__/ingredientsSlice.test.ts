import ingredientsReducer, {
  getIngredientsThunk,
  clearError
} from '../ingredientsSlice';
import { createAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Биокотлета',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredientsSlice', () => {
  test('должен вернуть начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: '' });
    expect(state).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });
  });

  test('должен вернуть текущее состояние при неизвестном экшене', () => {
    const initialState = {
      ingredients: mockIngredients,
      loading: true,
      error: 'test error'
    };
    const unknownAction = createAction('unknown/action')();
    const state = ingredientsReducer(initialState, unknownAction);
    expect(state).toEqual(initialState);
  });

  test('должен установить loading=true при pending', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredientsThunk.pending('')
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен установить error при rejected', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredientsThunk.rejected(new Error('Ошибка загрузки'), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  test('должен использовать fallback для error при rejected без сообщения', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredientsThunk.rejected(new Error(), '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).not.toBeNull();
  });

  test('должен загрузить ингредиенты при fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredientsThunk.fulfilled(mockIngredients, '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('должен очистить error при clearError', () => {
    const stateWithError = {
      ingredients: [],
      loading: false,
      error: 'some error'
    };
    const state = ingredientsReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });
});
