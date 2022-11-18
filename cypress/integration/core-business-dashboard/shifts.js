/// <reference types="Cypress" />

describe('Shifts', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024);
    cy.server();

    cy.route({
      headers: {
        'Content-Type': 'application/json'
      },
      url: `**/cities`,
      method: 'GET',
      response: 'fixture:cities'
    }).as('citiesJSON');

    cy.fixture('shifts').then(({ shifts }) => {
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const ts = new Date(new Date().toDateString()).getTime() - tzOffset;
      const hourMs = 3600000;
      const startDate = new Date(ts + 10 * hourMs).toISOString();
      const endDate = new Date(ts + 18 * hourMs).toISOString();

      // Patch payload
      const payload = {
        shifts: shifts.map(driver => ({
          ...driver,
          ['driver_shifts']: driver['driver_shifts'].map(shift => ({
            ...shift,
            ['start_date']: startDate.replace('.000', ''),
            ['end_date']: endDate.replace('.000', '')
          }))
        }))
      };

      cy.route({
        delay: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        url: `**/shifts/*`,
        method: 'GET',
        response: payload
      }).as('shiftsJSON');
    });

    cy.visit(Cypress.config('baseUrl') + '/shifts');
    cy.wait('@citiesJSON');
  });

  context('Weekly schedule', () => {
    it('should show shifts', () => {
      cy.get('[data-testid="day-event"]')
        .as('shifts')
        .should('have.length', 4);

      cy.get('@shifts')
        .first()
        .find('h1')
        .should('have.text', 'NAA 8719');

      cy.get('@shifts')
        .first()
        .find('h2')
        .should('have.text', '10:00 - 18:00');

      cy.get('[data-testid="day-event-item"]')
        .should('have.length', 4)
        .first()
        .should('have.text', 'patric jason');
    });
  });

  context('Import a .csv file', () => {

    it('should upload a csv file successfully', () => {
      cy.route({
        delay: 500,
        headers: {
          'Content-Type': 'text/csv'
        },
        url: `/api/v1/driver_shift/city/*`,
        method: 'PUT',
        response: 'fixture:csvImportSuccess'
      }).as('importSuccess');

      cy.get('[data-testid="file-input"]')
        .attach('../files/shifts.csv')
        .trigger('input', { force: true });

      cy.wait('@importSuccess').then(() => {
        cy.get('[data-testid="notification"]')
          .as('notification')
          .should('have.text', 'Shifts were successfully imported')
          .and('be.visible');

        cy.wait(3000);
        cy.get('@notification').should('not.be.visible');
      });
    });

    it('should show server validation errors', () => {
      cy.route({
        delay: 500,
        headers: {
          'Content-Type': 'text/csv'
        },
        url: `/api/v1/driver_shift/city/*`,
        method: 'PUT',
        response: 'fixture:csvImportFailure',
        status: 400
      }).as('importFailure');

      cy.get('[data-testid="file-input"]')
        .attach('../files/shifts.csv')
        .trigger('input', { force: true });

      cy.wait('@importFailure').then(() => {
        cy.get('[data-testid="schedule-errors-pane"]')
          .as('errors')
          .should('be.visible');

        cy.get('@errors')
          .find('h1')
          .should('have.text', 'Cannot import shifts.');

        cy.get('@errors')
          .find('li')
          .should('have.length', 4);

        cy.wait(1000);

        cy.get('[data-testid="schedule-errors-close"]')
          .click()
          .end()
          .get('@errors')
          .should('not.be.visible');
      });
    });

    it('should show a generic server error', () => {
      cy.route({
        delay: 500,
        headers: {
          'Content-Type': 'text/csv'
        },
        url: `/api/v1/driver_shift/city/*`,
        method: 'PUT',
        response: {},
        status: 500
      }).as('importServerError');

      cy.get('[data-testid="file-input"]')
        .attach('../files/shifts.csv')
        .trigger('input', { force: true });

      cy.wait('@importServerError').then(() => {
        cy.get('[data-testid="notification"]')
          .as('notification')
          .should('contain.text', 'Import failed.')
          .and('be.visible');

        cy.wait(3000);
        cy.get('@notification').should('not.be.visible');
      });
    });
  });
});
