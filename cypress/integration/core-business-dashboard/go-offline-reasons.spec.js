/* The following links are about Cypress core concepts and best practices
https://docs.cypress.io/guides/references/best-practices.html
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#When-To-Assert
https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Run-Serially
*/

/// <reference types="Cypress" />

describe('Go Offline Reasons Configuration', () => {

    before(() => {
        cy.clearOfflineReasons();
        cy.reload();
        cy.wait(3000);
    });


    //navigate to settings page
    beforeEach(() => {

        cy.visit(Cypress.config('baseUrl') + '/settings');

    });

    context('Offline reasons configuration', () => {

        it('Choose city', () => {
            cy.wait(1000);
            cy.get('[data-testid="settings-header"]').get('[data-testid="option-1"]').click({force: true});
        });

        let char = Math.random().toString(36).substring(1);
        let word = Math.random().toString(36).substring(6);
        let word31 = word + word + word + word + word + char;

        it('Unable to create new offline reason with >30 #characters', () => {
            cy.wait(1000);
            cy.get('[data-testid="go-offline-reasons"').contains('Add reason').click({force: true});
            cy.get('[data-testid="beat-textInput"').eq(0).type(char, {force: true});
            for (let i = 1; i < 5; i++) {
                cy.get('[data-testid="beat-textInput"').eq(i).type(word, {force: true});
            }
            cy.get('[data-testid="beat-textInput"').eq(5).type(word31, {force: true});
            cy.get('[data-testid="go-offline-reasons"').contains('Save changes').click({force: true});
            cy.get('[data-testid="offline-reason-fields"]').should((element) => {
                expect(element).to.contain('You have exceeded character limit');
            });
        });

        it('Unable to create 2 offline reasons with same code', () => {

            cy.wait(1000);
            cy.get('[data-testid="go-offline-reasons"').contains('Add reason').click({force: true});
            cy.get('[data-testid="go-offline-reasons"').contains('Add reason').click({force: true});
            cy.get('[data-testid="beat-textInput"').eq(0).type(char, {force: true});
            for (let i = 1; i < 6; i++) {
                cy.get('[data-testid="beat-textInput"').eq(i).type(word, {force: true});
            }
            cy.get('[data-testid="beat-textInput"').eq(6).type(char, {force: true});
            for (let i = 7; i < 12; i++) {
                cy.get('[data-testid="beat-textInput"').eq(i).type(word, {force: true});
            }
            cy.get('[data-testid="go-offline-reasons"').contains('Save changes').click({force: true});
            cy.get('[data-testid="offline-reason-fields"]').should((element) => {
                expect(element).to.contain('This unique id is already taken');
            });
        });

        it('Create new offline reason', () => {

            cy.wait(1000);
            cy.get('[data-testid="go-offline-reasons"').contains('Add reason').click({force: true});
            cy.get('[data-testid="beat-textInput"').eq(0).type(char, {force: true});
            for (let i = 1; i < 6; i++) {
                cy.get('[data-testid="beat-textInput"').eq(i).type(word, {force: true});
            }
            cy.get('[data-testid="go-offline-reasons"').contains('Save changes').click({force: true});
            cy.get('[data-testid="beat-button"').contains('Save').click({force: true});
        });


        it('Deactivate existing offline reason', () => {
            cy.wait(1000);
            cy.get('[data-testid="offline-reason-visibility"').click({force: true});
            let char = Math.random().toString(36).substring(1);
            cy.get('[data-testid="beat-textInput"').eq(0).type(char);
            cy.once('fail', (err) => {
                // Assert the expected error
                expect(err.message).to.include('cy.type() failed because this element');
                expect(err.message).to.include('is being covered by another element');

            });
        });

        it('Activate existing offline reason', () => {
            cy.get('[data-testid="offline-reason-visibility"').click({force: true});
        });

        it('Edit existing offline reason', () => {

            let newchar = Math.random().toString(36).substring(1);
            let newword = Math.random().toString(36).substring(6);
            cy.wait(1000);
            cy.get('[data-testid="go-offline-reasons"').contains('Add reason').click({force: true});
            /*Edit the existing offline reason which was created in the previous test. All fields except for code
            * can be editted*/
            cy.get('[data-testid="beat-textInput"').eq(0).type(newchar, {force: true});
            for (let i = 1; i < 4; i++) {
                cy.get('[data-testid="beat-textInput"').eq(i).type(newword, {force: true});
            }
            cy.get('[data-testid="go-offline-reasons"').contains('Save changes').click({force: true});
            cy.get('[data-testid="beat-button"').contains('Save').click({force: true});
        });

        it('Change city - None Offline Reason is set', () => {
            cy.get('[data-testid="settings-header"]').get('[data-testid="option-2"]').click({force: true});
            cy.wait(1000);
            cy.get('[data-testid="grid-draggable-row"').should('not.exist');
        });

    });

});