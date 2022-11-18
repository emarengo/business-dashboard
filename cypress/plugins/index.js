// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const mysql = require('mysql');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');


let connection;

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    /**
     * This function creates a connection to SQL database
     * * @param {Object} connectionDetails The SQL database connection details
     */
    on('task', {
        connectToMySql: (connectionDetails) => {
            connection = mysql.createConnection({
                host: connectionDetails.host,
                port: connectionDetails.port,
                user: connectionDetails.user,
                password: connectionDetails.password,
                database: connectionDetails.database
            });
            return null;
        },

        /**
         * This function takes input the queryDetails and executes it on MYSQL
         * @function sqlQuery
         * @param queryDetails -> The MYSQL Query
         * @return result -> The query results
         */
        'sqlQuery': (queryDetails) => {
            return new Promise((resolve, reject) => {
                const sql = {
                    query: queryDetails.query
                };
                connection.query(sql.query, function(err, result) {
                    console.log(sql.query);
                    if (err) {
                        return reject(err);
                    }
                    console.log(result);
                    return resolve(result);
                });
            });
        }

    });


    /**
     * @function log() -> Takes as a parameter @param message, either text or a variable.
     * @param message -> The message to be parsed.
     * @return message
     */
    on('task', {
        log(message) {
            console.log(message);
            return message;
        }
    });

    initPlugin(on, config);
    return config;

};
