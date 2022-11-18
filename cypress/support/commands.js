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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { getCBSQLConDetails, getRestSQLConDetails } from './sharedUtilities';

/**
 * @function updateCityParmas -> Calls REST @API\Uri("/taxidmin/core/city/{id_city}")
 * @param @API\Field(name="id_city",  required=true,  source="URL",  type="int")
 * @param field you want to update
 * @return JSON response
 */
Cypress.Commands.add('updateCity', (cityId, cityDetails) => {
  cy.fixture(cityDetails).then($cityDetailsData => {
    cy.request({
      url: Cypress.env('CB_URL') + '/api/v1/city/' + cityId,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: $cityDetailsData,
    }).then(response => {
      expect(response.status).to.eq(204);
      cy.task('log', response);
    });
  });
});

Cypress.Commands.add('clearOfflineReasons', () => {
  cy.task('connectToMySql', getRestSQLConDetails());
  cy.task('sqlQuery', {
    query: 'DELETE FROM ot_partner_driver_availability_analytics;'
  }).then(() => {
    cy.task('sqlQuery', { query: 'DELETE FROM ot_driver_offline_reason;' });
  });
});

Cypress.Commands.add(
  'attach',
  {
    prevSubject: 'element'
  },
  (inputElement, fileName, mimeType) => {
    cy.fixture(fileName, 'base64')
      .then(content => Cypress.Blob.base64StringToBlob(content, mimeType))
      .then(blob => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([blob], fileName));
        inputElement[0].files = dataTransfer.files;
        return inputElement;
      });
  }
);

Cypress.Commands.add('insertFiltersToCoreBusinessDB', () => {
  cy.task('connectToMySql', getCBSQLConDetails());
  cy.task('sqlQuery', {
    query: "INSERT INTO city_area_filters (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES\n" +
      "(1, 'AB', '2020-08-10 10:24:45', '2020-08-10 10:24:45', NULL),\n" +
      "(2, 'Business', '2020-08-10 10:24:59', '2020-08-10 10:24:59', NULL),\n" +
      "(3, 'Transportation terminal', '2020-08-10 10:25:09', '2020-08-10 10:25:28', NULL),\n" +
      "(4, 'Commercial', '2020-08-10 10:25:20', '2020-08-10 10:25:20', NULL),\n" +
      "(5, 'Tourism landmark', '2020-08-10 10:25:38', '2020-08-10 10:25:38', NULL),\n" +
      "(6, 'Entertainment', '2020-08-10 10:25:54', '2020-08-10 10:25:54', NULL);"
  }).then(() => {
    cy.task('sqlQuery', { query: 'SELECT name FROM city_area_filters;' });
  });
});

Cypress.Commands.add('deleteAllFiltersFromCoreBusinessDB', () => {
  cy.task('connectToMySql', getCBSQLConDetails());
  cy.task('sqlQuery', {
    query: "DELETE FROM city_area_filters;"
  }).then(() => {
    cy.task('sqlQuery', { query: 'SELECT name FROM city_area_filters;' });
  });
});
