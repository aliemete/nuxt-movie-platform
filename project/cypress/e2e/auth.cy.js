describe('Авторизация', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/');
  });

   it('Не Успешная авторизация', () => {
    cy.fixture('user').then(user => {
      cy.wait(1000)
      // Открываем модалку
      cy.get('.auth-button').click({ force: true });
      
      // Проверяем что модалка открылась
      cy.get('.auth-modal-content').should('be.visible');
      
      // Заполняем форму
      cy.get('#email').type('email');
      cy.get('#password').type('password');
      
      // Отправляем форму
      cy.get('.submit-button').click();
      cy.wait(5000)
      cy.get('.close-modal-button').click();


  }); 
});
it('Успешная авторизация', () => {

  cy.fixture('user').then(user => {


    cy.get('.auth-button').then($btn => {
      console.log('Button classes:', $btn.attr('class'));
      console.log('Button text:', $btn.text());
    });

    cy.wait(1000)
    // Открываем модалку
    cy.get('.auth-button').click({ force: true });
    


    // Проверяем что модалка открылась
    cy.get('.auth-modal-content').should('be.visible');
    
    // Заполняем форму
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    
    // Отправляем форму
    cy.get('.submit-button').click();

    // Проверяем обновление кнопки в хедере
    cy.get('.auth-button.authenticated')
      .should('exist')
      .and('contain', user.name || user.email.split('@')[0])
      .click();

    // Переход в аккаунт и проверка URL
    cy.url().should('include', '/account');

    // Переходим в раздел "Настройки"
    cy.get('button.account-menu-link')
      .contains('Настройки')
      .click();

    // Проверка данных в блоке account-authen
    cy.get('.account-authen').within(() => {
      cy.get('.user-info')
        .should('contain', user.name)
        .and('contain', user.surname);
        
      cy.get('.user-mail .user-info')
        .should('contain', user.email);
    });

    // Выходим из аккаунта
    cy.get('button.logout-button')
      .contains('Выйти из аккаунта')
      .click();
  });
});
});
