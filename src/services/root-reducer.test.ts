import { rootReducer } from './root-reducer';

// Мокаем state slices для проверки начального состояния
const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(initialState).toBeDefined();
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('constructorItems');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('auth');
  });
});
