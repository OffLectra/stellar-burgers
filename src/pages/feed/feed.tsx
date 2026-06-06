import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { getFeedsThunk } from '@slices/feedsSlice';
import {
  selectFeedsOrders,
  selectFeedsLoading,
  selectFeedsError
} from '@selectors';
import { Preloader } from '@ui';
import { Button } from '@zlden/react-developer-burger-ui-components';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedsOrders);
  const loading = useSelector(selectFeedsLoading);
  const error = useSelector(selectFeedsError);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(getFeedsThunk());
    }
  }, [dispatch]);
  if (loading) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <h2 className='text text_type_main-large mb-4'>{error}</h2>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          onClick={() => dispatch(getFeedsThunk())}
        >
          Обновить
        </Button>
      </div>
    );
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeedsThunk())} />
  );
};
