import { FC, useMemo, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '@services/store';
import { selectIngredients, selectIngredientsLoading } from '@selectors';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '@ui/preloader';
import { OrderInfoUI } from '@ui/order-info';
import { TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';
import { getIngredientsThunk } from '@slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredientsThunk());
    }
  }, [dispatch, ingredients.length]);

  const location = useLocation();
  const isPage = !location.state?.background;
  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          setOrderData(data.orders[0]);
        })
        .catch(() => {
          setOrderData(null);
        });
    }
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
      isPage
    };
  }, [orderData, ingredients]);

  if (ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
