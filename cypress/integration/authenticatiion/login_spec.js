import page from '../../pages/login';

const setupLoggedInServer = () => {
  cy.server();
  cy.route('POST', '/api/2.0/users/login', 'fx:loginSuccess').as('login');
  cy.route('/api/2.0/users/instance', 'fx:parentLoggedIn').as('instance');
  cy.route('POST', '/api/2.0/dojos/users', 'fx:userDojosChampion').as('userDojosChampion');
};

describe('Login Page', () => {
  describe('Form Validation', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should show the header, login box, and all login box elements', () => {
      cy.get(page.header).should('be.visible');
      cy.get(page.loginBox).should('be.visible');
      cy.get(page.email).should('be.visible');
      cy.get(page.password).should('be.visible');
      cy.get(page.login).should('be.visible');
      cy.get(page.forgotPassword).should('be.visible');
      cy.get(page.register).should('be.visible');
      cy.get(page.forgotPasswordLink).should('have.attr', 'href', '/reset');
      cy.get(page.registerLink).should('have.attr', 'href', '/register');
    });

    it('should show an error when no email is provided on a blur event', () => {
      cy.get(page.emailFormatError).should('not.be.visible'); // TODO: Should be emailReqError?
      cy.get(page.email).click();
      cy.get(page.email).invoke('text').should('eq', '');
      cy.get(page.password).click();
      cy.get(page.emailFormatError).should('be.visible');
    });

    it('should show an error when no password is provided on a blur event', () => {
      cy.get(page.passwordReqError).should('not.be.visible');
      cy.get(page.password).click();
      cy.get(page.password).invoke('text').should('eq', '');
      cy.get(page.loginBox).click();
      cy.get(page.passwordReqError).should('be.visible');
    });

    it('should show an error when the email input is not in the correct format', () => {
      cy.get(page.emailFormatError).should('not.be.visible');
      cy.get(page.email).click();
      cy.get(page.email).type('janedoe');
      cy.get(page.password).click();
      cy.get(page.emailFormatError).should('be.visible');
    });

    it('should show an error when the login fails (on mock server this is only when failure@example.com email is provided)', () => {
      cy.server();
      cy.route('POST', '/api/2.0/users/login', 'fx:loginFail').as('loginFail');
      cy.get(page.loginFailed).should('not.be.visible');
      cy.get(page.email).click();
      cy.get(page.email).type('janedoe@test.com');
      cy.get(page.password).type('wrongpassword');
      cy.get(page.login).click();
      cy.wait('@loginFail');
      cy.get(page.loginFailed).should('be.visible');
    });

    it('should show an raspberry linked error when login fails because linked (on mock server this is only when raspberry@example.com email is provided)', () => {
      cy.server();
      cy.route('POST', '/api/2.0/users/login', 'fx:loginRaspberryFail').as('loginRaspberryFail');
      cy.get(page.loginFailed).should('not.be.visible');
      cy.get(page.email).click();
      cy.get(page.email).type('janedoe@test.com');
      cy.get(page.password).type('rightpassword');
      cy.get(page.login).click();
      cy.wait('@loginRaspberryFail');
      cy.get(page.loginRaspberryFailed).should('be.visible');
    });

    it('should show both requirement errors when a login is attempted if no email and no password is provided', () => {
      cy.get(page.emailFormatError).should('not.be.visible'); // TODO: Should be emailReqError?
      cy.get(page.passwordReqError).should('not.be.visible');
      cy.get(page.login).click();
      cy.get(page.emailFormatError).should('be.visible');
      cy.get(page.passwordReqError).should('be.visible');
    });

    it('should show only the email format error when a login is attempted if no password and incorrect form of email is provided', () => {
      cy.get(page.emailFormatError).should('not.be.visible');
      cy.get(page.email).type('janedoe');
      cy.get(page.login).click();
      cy.get(page.emailFormatError).should('be.visible');
    });

    it('should show password requirement error when a login is attempted if no password but an email is provided', () => {
      cy.get(page.passwordReqError).should('not.be.visible');
      cy.get(page.email).type('janedoe@test.com');
      cy.get(page.login).click();
      cy.get(page.passwordReqError).should('be.visible');
    });

    it('should show email requirement error when a login is attempted if no email but a password is provided', () => {
      cy.get(page.emailFormatError).should('not.be.visible'); // TODO: Should be emailReqError?
      cy.get(page.password).type('test123');
      cy.get(page.login).click();
      cy.get(page.emailFormatError).should('be.visible');
    });
  });

  describe('Successful Login', () => {
    it('should login successfully without a referrer query param', () => {
      cy.visit('/login');
      setupLoggedInServer();
      cy.get(page.email).type('parent1@example.com');
      cy.get(page.password).type('testparent1');
      cy.get(page.login).click();
      cy.url().should('include', '/home');
    });

    it('should login successfully with a referrer query param', () => {
      cy.visit('/login?referrer=%2Fdashboard%2Ftickets');
      setupLoggedInServer();
      cy.get(page.email).type('parent1@example.com');
      cy.get(page.password).type('testparent1');
      cy.get(page.login).click();
      cy.url().should('include', '/dashboard/tickets');
    });
  });
});
