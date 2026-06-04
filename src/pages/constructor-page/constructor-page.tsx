import { useEffect } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { getIngredientsThunk } from '@slices/ingredientsSlice';
import { selectIngredientsLoading, selectIngredientsError } from '@selectors';

import styles from './constructor-page.module.css';
import clsx from 'clsx';
import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <main className={styles.containerMain}>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={clsx(
          styles.title,
          'text',
          'text_type_main-large',
          'mt-10',
          'mb-5',
          'pl-5'
        )}
      >
        Соберите бургер
      </h1>
      <div className={clsx(styles.main, 'pl-5', 'pr-5')}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
