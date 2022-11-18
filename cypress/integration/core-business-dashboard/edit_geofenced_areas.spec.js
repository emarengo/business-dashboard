/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('Geofenced Areas View', () => {

    beforeEach(() => {
        cy.server();
        //upload specific polygons
        cy.route('GET', '/api/partners/areas/**', 'fixture:areas.json').as('areas');
        cy.route('GET', '/api/cityareas').as('cityareas');
        cy.route('/api/cityareas/filters').as('filters');
        cy.route('/api/cityareas/details').as('details');

        //mock response when we try to add a new polygon to be a success
        cy.route({
            delay: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            url: `/api/partners/areas/**`,
            method: 'PUT',
            status: '200',
            response: "{\n" +
              "    \"id\": \"1d896889e389d89132c581ce833e990e\"\n" +
              "}"
        });

        cy.visit(Cypress.config('baseUrl') + '/geofence/1');
        //we have to wait until the map is loaded successfully
        cy.wait('@areas');
        cy.wait('@cityareas');
        cy.wait('@filters');
        cy.wait('@details');
        cy.wait(3000);
    });

    context('Edit Geofenced Areas ', () => {

        it('click on draw option, start drawing a partner city area, click save', () => {

            //click the edit option
            cy.get('[data-testid="editBtn"]').click();
            //click the draw option
            cy.get('[data-testid="drawBtn"]').click();
            //we have to wait until the draw option is visible on the map
            cy.wait(500);
            //start drawing a city area, the first and the last point should be the same in order for the selected city
            // area to be closed correctly
            cy.get(".mapboxgl-canvas")
              .click(650, 420)
              .click(650, 200)
              .click(675, 200)
              .click(675, 400)
              .click(650, 420);
            //we have to wait until the final polygon will be drawn
            cy.wait(200);
            //we have to find the correct coordinates to click the + icon
            cy.get(".mapboxgl-canvas")
              .click(658, 388);
            cy.get('[data-testid=saveBtn]').click();
            cy.get('[data-testid="beat-modal"]');
            cy.get('[data-testid="yesOptionBtn"]').click();
            cy.wait(500);
            cy.get(".mapboxgl-canvas").should('be.visible')

        });

        it('assert that the remove button is visible ', () => {

            //click the edit option
            cy.get('[data-testid="editBtn"]').click();
            //select a partner area to remove
            cy.get(".mapboxgl-canvas")
              .click(500, 390);
            //click the - icon
            cy.get('div.remove-area-marker');

        });
    });
});
