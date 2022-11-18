/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('Edit custom points', () => {

    beforeEach(() => {

        //upload specific polygons
        cy.fixture('areas.json').then((data) => {
            cy.server();
            cy.route({
                delay: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                url: '/api/partners/areas/**',
                method: 'GET',
                response: data
            }).as('areas');
        });

        cy.visit(Cypress.config('baseUrl') + '/geofence/1');
        //we have to wait until the map is loaded successfully
        cy.wait('@areas');
        //we have to wait until the cities areas are loaded successfully from atlas
        //the response is too long and we can not avoid that for now.
        //a future improvement will be to keep the city area details for the
        //specific area we want and mock that response, but the maintenance wiil
        //be very difficult, and this specific tests needs to have the correct info
        cy.wait(13000);

    });

    context('Edit custom points functionality ', () => {

        it('add/remove/move a custom point', () => {

            //click the edit option
            cy.get('[data-testid="editBtn"]').click();
            //click in a specific point into a partner area
            //click the pin option
            cy.get('[data-testid="pinBtn"]').click();
            cy.get(".mapboxgl-canvas").click(500, 390);
            //click again the same point
            cy.wait(700);
            cy.get(".mapboxgl-canvas").click(500, 390);
            //the remove and move button should be visible
            cy.get('[data-testid="remove-btn"]');
            cy.get('[data-testid="move-btn"]');
            cy.get('[data-testid="move-btn"]').click();
            cy.get(".mapboxgl-canvas").trigger("mousemove", 500, 390,{ force: true });
            //a popup custom pin should be visible
            cy.get('[class="mapboxgl-popup custom-pin-drop-message mapboxgl-popup-anchor-bottom"]');
            cy.wait(2200);
            cy.get(".mapboxgl-canvas").click(500, 395);
            cy.get('[data-testid="remove-btn"]').should('not.exist');
            cy.get('[data-testid="move-btn"]').should('not.exist');

        });
    });

});
