/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('Edit', () => {
  // We declare an empty array to gather XHR responses
  before(() => {
    cy.deleteAllFiltersFromCoreBusinessDB();
    cy.insertFiltersToCoreBusinessDB();
    cy.server();
    //upload specific polygons
    cy.route('GET', '/api/partners/areas/**', 'fixture:areas.json').as('areas');
    cy.route('GET', '/api/cityareas').as('cityareas');
    cy.route('/api/cityareas/filters').as('filters');
    cy.route('/api/cityareas/details').as('details');

    cy.visit(Cypress.config('baseUrl') + '/geofence/1');
    //we have to wait until the map is loaded successfully
    cy.wait('@areas');
    cy.wait('@cityareas');
    cy.wait('@filters');
    cy.wait('@details');
    cy.wait(2000);
  });
  context('Filters', () => {
    it('The filter context is visible and no option is selected by default', () => {
      //click the edit option
      cy.get('[data-testid="editBtn"]').click();
      //click the filter button
      cy.get('[data-testid=filtersBtn]').click();
      //assert that the filter context is visible
      cy.get('[data-testid=FilterWrap]').should('be.visible');
      //assert that filter reset option is not visible
      cy.get('[data-testid=FiltersReset]').should('not.be.visible');
      //assert no option is selected.find('[data-testid=beat-checkbox]')
      cy.get('[data-testid=beat-checkbox]').each(($el) => {
        cy.wrap($el).parent().should('not.have.class', 'checked')
      });
    });

    it('The user can check all the available options', () => {
      cy.get('[data-testid=beat-checkbox]').click({ multiple: true })
        .each(($el) => {
          cy.wrap($el).parent().should('have.class', 'checked')
        });
      //assert that when at least one of the checkboxes is checked, the `reset all` button is visible
      cy.get('[data-testid=FiltersReset]').should('be.visible')

    });

    it('The user clicks on the Reset All button and all options are unselected', () => {
      cy.get('[data-testid=FiltersReset]').click()
      cy.get('[data-testid=FiltersReset]').should('not.be.visible');
      cy.get('[data-testid=beat-checkbox]').as('allOptions').each(($el) => {
        cy.wrap($el).parent().should('not.have.class', 'checked')
      })
    });

    it('The user selects one option and should be able to see the highlighted areas in the map', () => {
      //assert that one of the filters exists and is not checked
      cy.get('[data-testid=filter-Commercial]')
        .find('[data-testid=beat-checkbox]').as('commercialCheckBox')
        .parent()
        .should('not.have.class', 'checked');
      //assert that when the checkbox is clicked, then it is checked
      cy.get('@commercialCheckBox')
        .click().parent()
        .should('have.class', 'checked');
      /*
      Assert that the canvas contains the highlighted city areas due to
      the enabled filter
      --------------------------
      The Image snapshot comparison currently succeeds only when the
      test is run in headless mode using electron. The related
      plugin is buggy and renders a slightly different color when
      test is run in --headed mode. Running the test in a different
      browser again fails this check
      */
      cy.get(".mapboxgl-canvas")
        .dblclick().wait(5000)  //Wait for all the map elements to be rendered properly
        .toMatchImageSnapshot(
          { imageConfig: { threshold: 0.001 } }
        );
      //close the filter context
      cy.get('[data-testid=filtersBtn]').click();
      cy.get(".mapboxgl-canvas").should('be.visible');
      //reopen the filter context
      cy.get('[data-testid=filtersBtn]').click();
      //the previous selection should be cleared
      cy.get('@commercialCheckBox').parent().should('not.have.class', 'checked');
    });
  });
});
