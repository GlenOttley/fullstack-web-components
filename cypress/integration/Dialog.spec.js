describe('Dialog Component', () => {
  beforeEach(() => {
    cy.wait(1);
  });

  it('should display a dialog', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root').get('in-modal').should('exist');
  });

  it('should close a dialog', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root')
      .get('in-modal')
      .find('[slot="action"]')
      .find('button')
      .click();
    cy.get('#root').get('in-modal').should('not.exist');
  });

  it('should close and open dialog again', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root')
      .get('in-modal')
      .find('[slot="action"]')
      .find('button')
      .click();
    cy.get('#root').get('button').click();
    cy.get('#root').get('in-modal').should('exist');
  });

  it('should open another dialog', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root')
      .get('in-modal')
      .find('[slot="footer"]')
      .find('button')
      .click();
    cy.get('#root').get('in-modal').eq(1).should('exist');
  });

  it('should open and close tooltip', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root')
      .get('in-modal')
      .find('[slot="footer"]')
      .find('button')
      .click();
  });
  cy.get('#root')
    .get('in-modal')
    .eq(1)
    .find('[slot="content"]')
    .find('[data-dialog-id="tooltip-help-target"]')
    .click();
  cy.get('#root').click();
  cy.get('#root').get('in-tooltip').should('not.exist');

  it('should open and close all dialogs', () => {
    cy.visit('iframe.html?id=components-dialog--primary');
    cy.get('#root')
      .get('in-modal')
      .find('[slot="footer"]')
      .find('button')
      .click();

    cy.get('#root')
      .get('in-modal')
      .eq(1)
      .find('[slot="content"]')
      .find('[data-dialog-id="tooltip-help-target"]')
      .click();
    cy.get('#root').click();
    cy.get('#root')
      .get('in-modal')
      .eq(1)
      .find('[slot="footer"]')
      .find('.dialog-close-button')
      .click();

    cy.get('#root')
      .get('in-modal')
      .find('[slot="action"]')
      .find('button')
      .click();
    cy.get('#root').get('in-modal').should('not.exist');
    cy.get('#root').get('in-tooltip').should('not.exist');
  });
});
