import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { useLocation } from 'react-router-dom';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orders, isLoading } = useSelector((state) => state.feed);
  const { items: ingredients, isLoading: isIngredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (isLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
