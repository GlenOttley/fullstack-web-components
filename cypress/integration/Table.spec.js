describe('Table Component', () => {
  beforeEach(() => {
    cy.wait(100);
  });

  it('should enter edit mode', () => {
    cy.visit('iframe.html?id=components-table--primary');

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="footer"]')
      .find('.button-edit')
      .click();

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .find('td')
      .find('in-textinput')
      .should('exist');
  });

  it.skip('should edit a text field', () => {
    cy.visit('iframe.html?id=components-table--primary');

    // click the edit button
    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="footer"]')
      .find('.button-edit')
      .click();

    // clear the text from the first td input element in the table
    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('in-textinput')
      .click()
      .shadow()
      .find('input')
      .clear();

    // type 'jane@doe.com' into the first td input element in the table
    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('in-textinput')
      .click()
      .shadow()
      .find('input')
      .type('jane@doe.com');

    // click the first td input element again to prevent cypress trying to focus on the save button in the next step
    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('in-textinput')
      .shadow()
      .find('input')
      .click();

    cy.wait(1000);

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="footer"]')
      .find('.button-save')
      .click();

    cy.wait(1000);

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('span')
      .contains('jane@doe.com');
  });

  it('should cancel edit mode', () => {
    cy.visit('iframe.html?id=components-table--primary');

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="footer"]')
      .find('.button-edit')
      .click();

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('in-textinput')
      .click()
      .shadow()
      .find('input')
      .clear();

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('in-textinput')
      .click()
      .shadow()
      .find('input')
      .type('jane@doe.com');

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="footer"]')
      .find('.button-cancel')
      .click();

    cy.get('#root')
      .get('[channel="table:one"]')
      .shadow()
      .find('[slot="content"]')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .first()
      .find('span')
      .contains('joe@gmail.com');
  });
});
