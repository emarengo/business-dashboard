//Helper methods are defined in this file

/**
 * This method returns the dashboard's Mongo connection details
 */

//variables to run it to terminal (not included to cypress.env.json)
/**
 *
 * @returns {{password: *, database: *, port: *, host: *, user: *}}
 */

export function getRestSQLConDetails() {
    return {
        database: Cypress.env('REST_MYSQL_DATABASE'),
        host: Cypress.env('MYSQL56_HOST'),
        port: Cypress.env('MYSQL_PORT'),
        user: Cypress.env('MYSQL_USER'),
        password: Cypress.env('MYSQL_PASSWORD'),
    };
}

export function getCBSQLConDetails() {
    return {
        database: Cypress.env('CB_MYSQL_DATABASE'),
        host: Cypress.env('MYSQL57_HOST'),
        port: Cypress.env('MYSQL_PORT'),
        user: Cypress.env('MYSQL_USER'),
        password: Cypress.env('MYSQL_PASSWORD'),
    };
}
