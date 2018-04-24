const LoginPage = require('../page-objects/login');

describe('Login Page', () => {
  // beforeEach(() => {
  //   LoginPage.open();
  // });

  it('should show the header, login box , and all login box elements', () => {
    LoginPage.open();
    expect(LoginPage.header.isVisible()).to.equal(true);
    expect(LoginPage.loginBox.isVisible()).to.equal(true);
    expect(LoginPage.email.isVisible()).to.equal(true);
    expect(LoginPage.password.isVisible()).to.equal(true);
    expect(LoginPage.login.isVisible()).to.equal(true);
    expect(LoginPage.forgotPassword.isVisible()).to.equal(true);
    expect(LoginPage.register.isVisible()).to.equal(true);
    expect(LoginPage.forgotPasswordLink.getAttribute('href')).to.contain('/reset');
    expect(LoginPage.registerLink.getAttribute('href')).to.contain('/register');
  });

  it('should show an error when no email is provided on a blur event', () => {
    LoginPage.open();
    expect(LoginPage.emailReqError.isVisible()).to.equal(false);
    LoginPage.email.click();
    expect(LoginPage.email.getText()).to.equal('');
    LoginPage.password.click();
    LoginPage.emailReqError.waitForVisible();
    expect(LoginPage.emailReqError.isVisible()).to.equal(true);
  });

  it('should show an error when no password is provided on a blur event', () => {
    LoginPage.open();
    expect(LoginPage.passwordReqError.isVisible()).to.equal(false);
    LoginPage.password.click();
    expect(LoginPage.password.getText()).to.equal('');
    LoginPage.loginBox.click();
    LoginPage.passwordReqError.waitForVisible();
    expect(LoginPage.passwordReqError.isVisible()).to.equal(true);
  });

  it('should show an error when the email input is not in the correct format', () => {
    LoginPage.open();
    expect(LoginPage.emailFormatError.isVisible()).to.equal(false);
    LoginPage.email.click();
    LoginPage.email.setValue('janedoe');
    LoginPage.password.click();
    LoginPage.emailFormatError.waitForVisible();
    expect(LoginPage.emailFormatError.isVisible()).to.equal(true);
  });

  it('should show an error when the login fails (on mock server this is only when the incorrect email is provided)', () => {
    LoginPage.open();
    expect(LoginPage.loginFailed.isVisible()).to.equal(false);
    LoginPage.email.setValue('janedoe@test.com');
    LoginPage.password.setValue('test123');
    LoginPage.login.click();
    LoginPage.loginFailed.waitForVisible();
    expect(LoginPage.loginFailed.isVisible()).to.equal(true);
  });

  it('should show both requirement errors when a login is attempted if no email and no password is provided', () => {
    LoginPage.open();
    expect(LoginPage.emailReqError.isVisible()).to.equal(false);
    expect(LoginPage.passwordReqError.isVisible()).to.equal(false);
    LoginPage.login.click();
    LoginPage.emailReqError.waitForVisible();
    LoginPage.passwordReqError.waitForVisible();
    expect(LoginPage.emailReqError.isVisible()).to.equal(true);
    expect(LoginPage.passwordReqError.isVisible()).to.equal(true);
  });

  it('should show only the email format error when a login is attempted if no password and incorrect form of email is provided', () => {
    LoginPage.open();
    expect(LoginPage.emailReqError.isVisible()).to.equal(false);
    LoginPage.email.setValue('janedoe');
    LoginPage.login.click();
    LoginPage.emailFormatError.waitForVisible();
    expect(LoginPage.emailFormatError.isVisible()).to.equal(true);
  });

  it('should show password requirement error when a login is attempted if no password but an email is provided', () => {
    LoginPage.open();
    expect(LoginPage.passwordReqError.isVisible()).to.equal(false);
    LoginPage.email.setValue('janedoe@test.com');
    LoginPage.login.click();
    LoginPage.passwordReqError.waitForVisible();
    expect(LoginPage.passwordReqError.isVisible()).to.equal(true);
  });

  it('should show email requirement error when a login is attempted if no email but a password is provided', () => {
    LoginPage.open();
    expect(LoginPage.emailReqError.isVisible()).to.equal(false);
    LoginPage.password.setValue('test123');
    LoginPage.login.click();
    LoginPage.emailReqError.waitForVisible();
    expect(LoginPage.emailReqError.isVisible()).to.equal(true);
  });

  it('should login successfully with a referrer query param', () => {
    LoginPage.open({ referrer: '/dashboard/tickets' });
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();
    expect(browser.getUrl()).to.contain('/dashboard/tickets');
  });

  it('should login successfully without a referrer query param', () => {
    LoginPage.open();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();
    expect(browser.getUrl()).to.equal(browser.options.baseUrl);
  });
});
