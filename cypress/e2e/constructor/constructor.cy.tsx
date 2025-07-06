/// <reference types="cypress" />

import ingredients from '../../fixtures/ingredients.json';
import orders from '../../fixtures/orders.json';

// Вспомогательная функция для добавления ингредиента по имени.
// Вынос компанды в файл commands.js посчитал не нужным, т.к. всего одна функция и она используется только в этом файле.
// Если в будущем появится больше таких функций, то можно будет вынести в отдельный файл
const addIngredient = (name: string) => {
  cy.get('[data-cy="ingredient-card"]')
    .contains(name)
    .closest('[data-cy="ingredient-card"]')
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
    cy.get('[data-cy="constructor-main"]').should('contain', mainName);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Создание заказа и проверка модального окна', () => {
    cy.visit('/login');
    addIngredient(bunName);
    addIngredient(mainName);
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', orders.order.number);
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor-main"]').should('contain', 'Выберите начинку');
    cy.contains('Выберите булки').should('exist');
  });
});
