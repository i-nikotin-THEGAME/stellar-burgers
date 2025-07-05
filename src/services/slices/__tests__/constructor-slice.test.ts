import { constructorReducer, constructorSlice } from '../constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const bun: TIngredient = { _id: '1', name: 'Булка', type: 'bun', proteins: 1, fat: 1, carbohydrates: 1, calories: 1, price: 1, image: '', image_mobile: '', image_large: '' };
  const ingredient: TConstructorIngredient = { id: '2', _id: '2', name: 'Начинка', type: 'main', proteins: 1, fat: 1, carbohydrates: 1, calories: 1, price: 1, image: '', image_mobile: '', image_large: '' };

  it('добавляет ингредиент', () => {
    const state = constructorReducer(undefined, constructorSlice.actions.addIngredient(ingredient));
    expect(state.ingredients).toContainEqual(ingredient);
  });

  it('удаляет ингредиент', () => {
    const startState = { ...constructorReducer(undefined, { type: '' }), ingredients: [ingredient] };
    const state = constructorReducer(startState, constructorSlice.actions.removeIngredient(ingredient.id));
    expect(state.ingredients).not.toContainEqual(ingredient);
  });

  it('меняет порядок ингредиентов', () => {
    const ing2 = { ...ingredient, id: '3', _id: '3', name: 'Начинка2' };
    const startState = { ...constructorReducer(undefined, { type: '' }), ingredients: [ingredient, ing2] };
    const state = constructorReducer(startState, constructorSlice.actions.moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[1]).toEqual(ingredient);
    expect(state.ingredients[0]).toEqual(ing2);
  });
});
