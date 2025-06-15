describe('Работа с избранным', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  const loginThroughModal = (email, password) => {
    cy.get('.auth-modal-content').should('be.visible');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('.submit-button').click();
    cy.get('.auth-button.authenticated', { timeout: 10000 }).should('exist');
  };

  const checkFavoriteState = (movieId) => {
    return cy.request({
      method: 'GET',
      url: 'https://cinemaguide.skillbox.cc/profile',
      credentials: 'include'
    }).then((response) => {
      return (response.body.favorites || []).includes(String(movieId));
    });
  };

  const verifyFavoriteInUI = (movieTitle, shouldExist) => {
    cy.get('.auth-button.authenticated').click();
    cy.get(`.movie-grid img[alt*="${movieTitle}"]`)
      .should(shouldExist ? 'exist' : 'not.exist');
    cy.visit('http://localhost:3000/account');
  };

  it('Constantine и 47 Ronin: полный цикл добавления/удаления', () => {
    cy.visit('http://localhost:3000/');
    cy.fixture('user').then(user => {
      // 1. Тест для Constantine
      cy.get('.search-input').type('constantine', { delay: 100 });
      cy.get('.search-result-item').first().click();
      cy.get('.movie-title').should('contain', 'Constantine');

      // 2. Клик избранное → модалка
      cy.get('.button-to-favorites').click();
      
      // 3. Авторизация
      cy.get('body').then($body => {
        if ($body.find('.auth-modal-content').length > 0) {
          loginThroughModal(user.email, user.password);
        }
      });

      // 4. Проверка и добавление если нужно
      checkFavoriteState('561').then(isFavorite => {
        if (!isFavorite) {
          cy.get('.button-to-favorites').click();
          cy.wait(1000);
          checkFavoriteState('561').should('eq', true);
        }
        verifyFavoriteInUI('Constantine', true);
      });

      // 5. Тест для 47 Ronin
      cy.get('.search-input').clear().type('47 ronin', { delay: 100 });
      cy.get('.search-result-item').first().click();
      cy.get('.movie-title').should('contain', '47 Ronin');

      cy.get('.button-to-favorites').click();

      // 6. Полная обработка состояния для 47 Ronin
      checkFavoriteState('561').then(isFavorite => {
        if (!isFavorite) {
          cy.get('.button-to-favorites').click();
          cy.wait(1000);
          checkFavoriteState('561').should('eq', true);
        }
        verifyFavoriteInUI('Constantine', true);
      });
      cy.wait(10000);
            // 7. Удаление через крестик
            cy.get('.auth-button.authenticated').click();
            cy.get('.movie-grid img[alt="47 Ronin"]') // Находим изображение с нужным alt
              .parents('.poster-container') // Поднимаемся к контейнеру постера
              .find('.remove-btn') // Находим кнопку удаления внутри этого контейнера
              .click({ force: true });
            cy.wait(1000);

    });
  });
});