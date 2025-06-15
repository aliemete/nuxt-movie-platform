// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// beforeEach(() => {
//     // Очистка кук и localStorage
//     cy.clearCookies();
//     cy.clearLocalStorage();
    
//     // Принудительный сброс состояния хранилища
//     cy.window().then((win) => {
//       if (win.$nuxt) {
//         win.$nuxt.$store.dispatch('auth/logout');
//       }
//     });
    
//     // Перезагрузка страницы для гарантированного сброса
//     cy.visit('http://localhost:3000/', {
//       onBeforeLoad: (win) => {
//         win.sessionStorage.clear();
//       }
//     });
//   });

  Cypress.Commands.add('login', (email, password) => {
    // Проверяем, не авторизованы ли мы уже
    cy.get('body').then(($body) => {
      if ($body.find('.auth-button.authenticated').length === 0) {
        cy.get('.auth-button').click({ force: true });
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.get('.submit-button').click();
        cy.get('.auth-button.authenticated', { timeout: 10000 }).should('exist');
      }
    });
  });
  