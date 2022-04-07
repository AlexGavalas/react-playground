class DataTransfer {
    constructor() {
        this.data = {};
        this.types = [];
        this.files = [];
    }

    setData(format, data) {
        this.data[format] = data;
    }

    getData(format) {
        return this.data[format];
    }
}

describe('My First Test', () => {
    it('Does not do much!', () => {
        cy.visit('http://localhost:1234/');

        const dataTransfer = new DataTransfer();

        cy.get('#box2_1>div')
            .trigger('dragstart', {
                dataTransfer,
            })
            .get('#box2_2')
            .trigger('drop', { dataTransfer });
    });
});

export {};
