import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  resetConstructor
} from '../burgerConstructorSlice';
import { orderBurgerThunk } from '../ordersSlice';
import { createAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { TNewOrder } from '@api';

const bunIngredient: TIngredient = {
  _id: 'bun-1',
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
};

const mainIngredient: TIngredient = {
  _id: 'main-1',
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
};

const sauceIngredient: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('burgerConstructorSlice', () => {
  test('должен возвращать начальное состояние', () => {
    const state = burgerConstructorReducer(undefined, { type: '' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('должен возвращать текущее состояние при неизвестном экшене', () => {
    const prevState = {
      bun: { ...bunIngredient, id: 'test-bun-id' } as TConstructorIngredient,
      ingredients: []
    };
    const unknownAction = createAction('unknown/action')();
    const state = burgerConstructorReducer(prevState, unknownAction);
    expect(state).toEqual(prevState);
  });

  test('addIngredient: устанавливает булку', () => {
    const state = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );
    expect(state.bun).not.toBeNull();
    expect(state.bun!.name).toBe('Краторная булка N-200i');
    expect(state.bun!._id).toBe('bun-1');
    expect(state.bun!.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient: заменяет существующую булку новой', () => {
    const stateWithFirstBun = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );
    const firstBunId = stateWithFirstBun.bun!.id;

    const stateWithSecondBun = burgerConstructorReducer(
      stateWithFirstBun,
      addIngredient({ ...bunIngredient, _id: 'bun-2', name: 'Другая булка' })
    );
    expect(stateWithSecondBun.bun!._id).toBe('bun-2');
    expect(stateWithSecondBun.bun!.id).not.toBe(firstBunId);
    expect(stateWithSecondBun.ingredients).toHaveLength(0);
  });

  test('addIngredient: добавляет начинку в ingredients', () => {
    const state = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(mainIngredient)
    );
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Биокотлета');
  });

  test('addIngredient: можно добавить несколько ингредиентов', () => {
    const state1 = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(mainIngredient)
    );
    const state2 = burgerConstructorReducer(
      state1,
      addIngredient(sauceIngredient)
    );
    const state3 = burgerConstructorReducer(
      state2,
      addIngredient(mainIngredient)
    );

    expect(state3.bun).toBeNull();
    expect(state3.ingredients).toHaveLength(3);
  });

  test('removeIngredient: удаляет существующий ингредиент по id', () => {
    const stateWithItems = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(mainIngredient)
    );
    const idToRemove = stateWithItems.ingredients[0].id;

    const state = burgerConstructorReducer(
      stateWithItems,
      removeIngredient(idToRemove)
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('removeIngredient: удаление по несуществующему id не меняет массив', () => {
    const stateWithItems = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(mainIngredient)
    );

    const state = burgerConstructorReducer(
      stateWithItems,
      removeIngredient('non-existent-id')
    );
    expect(state.ingredients).toHaveLength(1);
  });

  describe('reorderIngredients', () => {
    test('перемещает ингредиент вверх (from > to)', () => {
      const stateWithItems = burgerConstructorReducer(
        { bun: null, ingredients: [] },
        addIngredient(mainIngredient) // main-1
      );
      const s2 = burgerConstructorReducer(
        stateWithItems,
        addIngredient(sauceIngredient)
      ); // sauce-1
      const s3 = burgerConstructorReducer(
        s2,
        addIngredient({
          ...mainIngredient,
          _id: 'main-2',
          name: 'Вторая котлета'
        })
      );

      const state = burgerConstructorReducer(
        s3,
        reorderIngredients({ from: 2, to: 0 })
      );
      expect(state.ingredients[0]._id).toBe('main-2');
      expect(state.ingredients[1]._id).toBe('main-1');
      expect(state.ingredients[2]._id).toBe('sauce-1');
    });

    test('перемещает ингредиент вниз (from < to)', () => {
      const stateWithItems = burgerConstructorReducer(
        { bun: null, ingredients: [] },
        addIngredient(mainIngredient)
      );
      const s2 = burgerConstructorReducer(
        stateWithItems,
        addIngredient(sauceIngredient)
      );
      const s3 = burgerConstructorReducer(
        s2,
        addIngredient({
          ...mainIngredient,
          _id: 'main-2',
          name: 'Вторая котлета'
        })
      );

      const state = burgerConstructorReducer(
        s3,
        reorderIngredients({ from: 0, to: 2 })
      );
      expect(state.ingredients[0]._id).toBe('sauce-1');
      expect(state.ingredients[1]._id).toBe('main-2');
      expect(state.ingredients[2]._id).toBe('main-1');
    });
  });

  test('resetConstructor: сбрасывает конструктор в initialState', () => {
    const filledState = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );
    const stateWithItems = burgerConstructorReducer(
      filledState,
      addIngredient(mainIngredient)
    );

    const state = burgerConstructorReducer(stateWithItems, resetConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
  const mockOrder: TNewOrder = {
    _id: '',
    status: 'done',
    name: 'test',
    owner: { name: '', email: '', createdAt: '', updatedAt: '' },
    createdAt: '',
    updatedAt: '',
    number: 1,
    price: 100
  };
  test('orderBurgerThunk.fulfilled: сбрасывает конструктор в initialState', () => {
    const filledState = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );
    const stateWithItems = burgerConstructorReducer(
      filledState,
      addIngredient(mainIngredient)
    );

    const state = burgerConstructorReducer(
      stateWithItems,
      orderBurgerThunk.fulfilled(mockOrder, '', [])
    );
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('orderBurgerThunk.pending: не меняет состояние конструктора', () => {
    const filledState = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );

    const state = burgerConstructorReducer(
      filledState,
      orderBurgerThunk.pending('', [])
    );
    expect(state).toEqual(filledState);
  });

  test('orderBurgerThunk.rejected: не меняет состояние конструктора', () => {
    const filledState = burgerConstructorReducer(
      { bun: null, ingredients: [] },
      addIngredient(bunIngredient)
    );

    const state = burgerConstructorReducer(
      filledState,
      orderBurgerThunk.rejected(null, '', [])
    );
    expect(state).toEqual(filledState);
  });
});
