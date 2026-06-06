import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { getOrdersThunk } from '@slices/ordersSlice';
import { selectUserOrders, selectUserOrdersLoading } from '@selectors';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(getOrdersThunk());
    }
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
