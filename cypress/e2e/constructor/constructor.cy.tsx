/// <reference types="cypress" />

import ingredients from '../../fixtures/ingredients.json';
import orders from '../../fixtures/orders.json';

// data-cy селекторы
const DATA_CY_INGREDIENT_CARD = '[data-cy="ingredient-card"]';
const DATA_CY_CONSTRUCTOR_MAIN = '[data-cy="constructor-main"]';
const DATA_CY_MODAL = '[data-cy="modal"]';
const DATA_CY_MODAL_CLOSE = '[data-cy="modal-close"]';
const DATA_CY_MODAL_OVERLAY = '[data-cy="modal-overlay"]';
const DATA_CY_ORDER_NUMBER = '[data-cy="order-number"]';

// Вспомогательная функция для добавления ингредиента по имени.
// Вынос компанды в файл commands.js посчитал не нужным, т.к. всего одна функция и она используется только в этом файле.
// Если в будущем появится больше таких функций, то можно будет вынести в отдельный файл
const addIngredient = (name: string) => {
  cy.get(DATA_CY_INGREDIENT_CARD)
    .contains(name)
    .closest(DATA_CY_INGREDIENT_CARD)
    .find('button')
    .contains('Добавить')
    .click();
};

describe('Burger Constructor E2E', () => {
  const bunName = ingredients.data.find((i) => i.type === 'bun')?.name ?? '';
  const mainName = ingredients.data.find((i) => i.type === 'main')?.name ?? '';

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'orders.json' }).as('createOrder');
    cy.setCookie('accessToken', 'mock-access-token');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'mock-access-token');
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
  });

  it('Добавление булки и начинки в конструктор', () => {
    addIngredient(bunName);
    addIngredient(mainName);
    cy.get('.constructor-element').filter(':contains("(верх)")').should('contain', bunName);
    cy.get('.constructor-element').filter(':contains("(низ)")').should('contain', bunName);
    cy.get(DATA_CY_CONSTRUCTOR_MAIN).should('contain', mainName);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get(DATA_CY_INGREDIENT_CARD).first().click();
    cy.get(DATA_CY_MODAL).should('be.visible');
    cy.get(DATA_CY_MODAL_CLOSE).click();
    cy.get(DATA_CY_MODAL).should('not.exist');
    cy.get(DATA_CY_INGREDIENT_CARD).first().click();
    cy.get(DATA_CY_MODAL).should('be.visible');
    cy.get(DATA_CY_MODAL_OVERLAY).click('topLeft', { force: true });
    cy.get(DATA_CY_MODAL).should('not.exist');
  });

  it('Создание заказа и проверка модального окна', () => {
    cy.visit('/login');
    addIngredient(bunName);
    addIngredient(mainName);
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get(DATA_CY_MODAL).should('be.visible');
    cy.get(DATA_CY_ORDER_NUMBER).should('contain', orders.order.number);
    cy.get(DATA_CY_MODAL_CLOSE).click();
    cy.get(DATA_CY_MODAL).should('not.exist');
    cy.get(DATA_CY_CONSTRUCTOR_MAIN).should('contain', 'Выберите начинку');
    cy.contains('Выберите булки').should('exist');
  });
});
