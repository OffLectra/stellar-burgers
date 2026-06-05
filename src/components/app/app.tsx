import { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  useParams
} from 'react-router-dom';
import { useDispatch } from '@services/store';
import { getUserThunk } from '@slices/userSlice';
import { getIngredientsThunk } from '@slices/ingredientsSlice';
import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';
import { AppHeader } from '@components';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { ProtectedRoute } from '@components/protected-route';
import styles from './app.module.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  const handleModalClose = () => navigate(-1);
  const FeedOrderModal = () => {
    const { number } = useParams();
    return (
      <Modal title={`#${number}`} onClose={handleModalClose}>
        <OrderInfo />
      </Modal>
    );
  };

  const ProfileOrderModal = () => {
    const { number } = useParams();
    return (
      <Modal title={`#${number}`} onClose={handleModalClose}>
        <OrderInfo />
      </Modal>
    );
  };
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        {/* Прямые ссылки на детали (без модалки) */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки */}
      {background && (
        <Routes>
          <Route path='/feed/:number' element={<FeedOrderModal />} />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={<ProfileOrderModal />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
