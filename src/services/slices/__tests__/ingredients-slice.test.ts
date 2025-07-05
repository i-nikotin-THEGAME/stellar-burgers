import { ingredientsReducer, fetchIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  it('pending: isLoading становится true', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending('', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: данные записываются, isLoading false', () => {
    const items: TIngredient[] = [{ _id: '1', name: 'test', type: 'main', proteins: 1, fat: 1, carbohydrates: 1, calories: 1, price: 1, image: '', image_mobile: '', image_large: '' }];
    const state = ingredientsReducer(undefined, fetchIngredients.fulfilled(items, '', undefined));
    expect(state.items).toEqual(items);
    expect(state.isLoading).toBe(false);
  });

  it('rejected: ошибка записывается, isLoading false', () => {
    const error = 'Ошибка';
    const state = ingredientsReducer(undefined, fetchIngredients.rejected(new Error(error), '', undefined, error));
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});
