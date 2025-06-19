import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const user = useSelector((state) => state.auth.user);
  const ingredients = useSelector((state) => state.ingredients.items);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getOrdersApi()
      .then((data) => {
        setOrders(data);
      })
      .catch((e) => setError(e?.message || 'Ошибка загрузки заказов'))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading) return <Preloader />;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
