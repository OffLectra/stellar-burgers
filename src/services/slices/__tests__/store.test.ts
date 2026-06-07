import { rootReducer } from '../../store';

describe('rootReducer', () => {
  test('должен возвращать начальное состояние всего store при undefined', () => {
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
