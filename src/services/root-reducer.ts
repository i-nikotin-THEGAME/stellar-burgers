import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { constructorReducer } from './slices/constructor-slice';
import { feedReducer } from './slices/feed-slice';
import { authReducer } from './slices/auth-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  feed: feedReducer,
  auth: authReducer
});
