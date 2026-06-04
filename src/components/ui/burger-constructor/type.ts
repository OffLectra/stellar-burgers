import { TNewOrder } from '@api';
import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TNewOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
