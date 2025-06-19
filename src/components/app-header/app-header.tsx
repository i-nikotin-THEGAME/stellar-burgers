import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = useSelector((state) => state.auth.user?.name || '');

  const handleConstructorClick = () => navigate('/');
  const handleFeedClick = () => navigate('/feed');
  const handleProfileClick = () => navigate('/profile');

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const profilePaths = [
    '/profile',
    '/register',
    '/login',
    '/forgot-password',
    '/reset-password'
  ];
  const isProfileActive = profilePaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <AppHeaderUI
      userName={userName}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
      isConstructorActive={isConstructorActive}
      isFeedActive={isFeedActive}
      isProfileActive={isProfileActive}
    />
  );
};
