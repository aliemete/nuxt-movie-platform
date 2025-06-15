describe('Тестирование навигации по жанрам', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('http://localhost:3000/');
    });
  
    it('Переход на страницу жанров через навигацию', () => {
      // 1. Проверяем активное состояние главной страницы
      cy.get('nav.navigation')
        .find('a.active-link')
        .should('contain', 'Главная');
      
      // 2. Находим и кликаем кнопку "Жанры"
      cy.get('nav.navigation')
        .find('a.nav-link')
        .contains('Жанры')
        .should('exist')
        .and('not.have.class', 'active-link')
        .click();
      
      // 3. Проверяем URL и активное состояние
      cy.url().should('eq', 'http://localhost:3000/genres');
      cy.get('nav.navigation')
        .find('a.nav-link')
        .contains('Жанры')
        .should('have.class', 'active-link');

        cy.wait(3000)
      
      // 4. Проверяем заголовок и список жанров
      cy.get('.genres-title').should('contain', 'Жанры фильмов');
      cy.get('.genres-grid .genre-item').should('have.length.gt', 0);

      cy.wait(3000)

    });
    it('Полный цикл навигации с возвратом', () => {
      // Переход на жанры
      cy.get('nav.navigation a.nav-link').contains('Жанры').click();
      
      // Добавляем паузу перед кликом
      cy.wait(2000);
      // Выбираем жанр "Комедия" через изображение
      cy.get('img.genre-image[alt="Постер жанра Комедия"]').click();
      
      // Проверяем заголовок жанра
      cy.get('.genre-title').should('contain', 'Комедия');
      cy.wait(3000)
      // Выбираем 3-й фильм
      cy.get('.movie-grid .movie-poster').eq(2).click();
      
      // Проверяем страницу фильма
      cy.url().should('include', '/movie/');
      cy.get('.movie-title').should('exist');
      cy.wait(3000)
      // Возврат через логотип
      cy.get('.logo-wrapper').click();
      cy.url().should('eq', 'http://localhost:3000/');
      
      // Проверяем активное состояние главной
      cy.get('nav.navigation a.active-link')
        .should('contain', 'Главная');
    });
  
    it('Проверка поиска после перехода в жанр', () => {
      cy.get('nav.navigation a.nav-link').contains('Жанры').click();
      cy.wait(3000)
      cy.get('.genres-grid .genre-item').first().click();
      
    });
  });