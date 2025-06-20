import { FC, ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { getUserApi } from '@api';
import {
  setUser,
  setAuthChecked,
  logout
} from '../../services/slices/auth-slice';

interface ProtectedRouteProps {
  children: ReactElement;
  anonymous?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      getUserApi()
        .then((res) => {
          if (res && res.user) {
            dispatch(setUser(res.user));
          } else {
            dispatch(setAuthChecked(true));
          }
        })
        .catch((err) => {
          if (err?.message === 'refreshToken expired') {
            dispatch(logout());
          } else {
            dispatch(setAuthChecked(true));
          }
        });
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (anonymous && isLoggedIn) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
