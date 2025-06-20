import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} from '../../services/slices/constructor-slice';
import { orderBurgerApi } from '@api';
import { addOrder } from '../../services/slices/feed-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector((state) => state.constructorItems);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const onOrderClick = async () => {
    if (!constructorItems.bun || constructorItems.orderRequest) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(setOrderRequest(true));
    try {
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];
      const orderData = await orderBurgerApi(ingredientIds);
      dispatch(setOrderModalData(orderData.order));
      dispatch(addOrder(orderData.order));
      dispatch(clearConstructor());
    } catch (e) {
    } finally {
      dispatch(setOrderRequest(false));
    }
  };
  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const isOrderDisabled =
    !constructorItems.bun ||
    constructorItems.ingredients.length === 0 ||
    constructorItems.orderRequest;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={constructorItems.orderRequest}
      constructorItems={constructorItems}
      orderModalData={constructorItems.orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isOrderDisabled={isOrderDisabled}
    />
  );
};
