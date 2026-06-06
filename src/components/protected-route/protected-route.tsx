import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { ReactElement } from 'react';
import { useSelector } from '@services/store';
import { selectIsAuthChecked, selectUser } from '@selectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' />;
  }

  return children;
};
