/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('Geofenced Areas View', () => {

    context('Geofenced Areas View details', () => {
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
            cy.wait(1000);
            //we have to wait until the cities areas are loaded successfully
            // cy.wait(6000);
        });
        it('move mouse to a geofenced area and check that the modal appears', () => {
            //click the edit option for the modal to be appeared
            cy.get('[data-testid="editBtn"]').click();
            //yourSelector
            cy.get( '[href="/geofence/1"] > [data-testid=nav-list-item]' )
              .trigger("mousedown", { button: 0 }, { force: true })
              .trigger("mousemove", 200, -200, { force: true })
            //yourTargetForDrop
            cy.get(".mapboxgl-canvas").click()
              .trigger("mousemove", { force: true });
            cy.get(".mapboxgl-popup").should('be.visible');

        });
    });

});
