describe('My First Test', () => {
    it('Does not do much!', () => {
        cy.intercept('GET', 'hello', (req) => {
            req.reply({
                fixture: 'example.json',
            });
        });

        cy.visit('http://localhost:1234/');
    });
});

export {};
