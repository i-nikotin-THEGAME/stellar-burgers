import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/auth-slice';
import { logoutApi } from '@api';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/;';
      dispatch(logout());
      navigate('/login', { replace: true });
    } catch (e) {}
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
