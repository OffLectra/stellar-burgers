import { FC, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '@services/store';
import { selectIngredients, selectIngredientsLoading } from '@selectors';
import { getIngredientsThunk } from '@slices/ingredientsSlice';
import { Preloader } from '@ui/preloader';
import { IngredientDetailsUI } from '@ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const location = useLocation();
  const isPage = !location.state?.background;

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredientsThunk());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find((i) => i._id === id) ?? null;

  if (loading || !ingredients.length) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <h2 className='text text_type_main-large'>Ингредиент не найден</h2>
      </div>
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {isPage && (
        <h2 className='text text_type_main-large mt-10 mb-5'>
          Детали ингредиента
        </h2>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
