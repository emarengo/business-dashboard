/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('View History page', () => {

    context('View History of a city', () => {

        it('all the view-history elements should be appeared', () => {

            cy.visit(Cypress.config('baseUrl') + '/geofence/1');
            //we have to wait until the areas are loaded
            cy.wait(10000);

            cy.get('[data-testid="historyBtn"]').click();

            cy.get('[data-testid="idInfoTitle"]');
            cy.get('[data-testid="idInfoValue"]');
            cy.get('[data-testid="activeInfoTitle"]');
            cy.get('[data-testid="activeInfoValue"]');
            cy.get('[data-testid="currentNode"]');
            cy.get('[data-testid="revertBtn"]');

        });

        it('try to load one older version of history', () => {

            //upload specific partner areas
            cy.fixture('areasVersionHistory.json').then((data) => {
                cy.server();
                cy.route({
                    delay: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: '/api/partners/areas/**',
                    method: 'GET',
                    response: data
                });
            });

            // find the yesterday date. One day is 86400000 milliseconds
            var date = new Date(Date.now() - 86400000);

            //upload specific version history
            cy.server();
            cy.route({
                delay: 500,
                headers: {
                    'Content-Type': 'application/json'
                    },
                    url: 'api/history/partners/**',
                    method: 'GET',
                    response:  [
                        {
                            "ID":"cd4ac58a2094b52d093f84ead1e530e3",
                            "Active":false,
                            "Previous":"",
                            "CreatedAt":date.getTime() / 1000,
                            "Action":"create"
                        },
                        {
                            "ID":"9a90f8d2ab25ec57e888cd308f457e9b",
                            "Active":true,
                            "Previous":"317a6b7d5bc9584655712fb82f1b0829",
                            "CreatedAt":1595946890,
                            "Action":"update"
                        }]

                });

            //see specific version of an area
            cy.fixture('areasVersionHistory.json').then((data) => {
                cy.server();
                cy.route({
                    delay: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: 'api/partners/area/**',
                    method: 'GET',
                    response: data
                });
            });

            var days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

            // Days part from the timestamp: Get the weekday as a number (0-6)
            var dayNumber = date.getDay();
            //Get the weekday as a name
            var day = days[dayNumber];

            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            //Get the month as a number (0-11) so we have to add 1 to get the right month
            var month = date.getMonth() + 1;
            // Will display time in " WED 5.8.2020 09:46:12" format
            var formattedTime = day + ' ' +  date.getDate()+ '.' +  month + '.'  + date.getFullYear()
              + ' '  + date.getHours() + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            cy.visit(Cypress.config('baseUrl') + '/history/1');

            //this is hardcoded because of the mocked data that loaded before.
            cy.get('[data-testid=" ' + formattedTime + '"]').click();
            cy.get('[data-testid="revertBtn"]').click();
            cy.get('[data-testid="beat-modal"]');
            cy.get('[data-testid="noOptionBtn"]').click();
            cy.get('[data-testid=" ' + formattedTime + '"]').should('have.class', 'isSelected')

        });

    });

});