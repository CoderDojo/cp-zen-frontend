import userPage from '../../pages/register-user';
import profilePage from '../../pages/register-profile';
import loginPage from '../../pages/login';
import homePage from '../../pages/home';

const uniqueEmail = `smoke_${String(Math.random()).slice(2)}@test.com`;
const password = 't3stt3st';

describe('Register, login & out Smoke', () => {
  it('should register', () => {
    cy.visit('/register/user');

    cy.get(userPage.firstName).type('Namey');
    cy.get(userPage.surname).type('McNameFace');
    cy.get(userPage.emailAddress).type(uniqueEmail);
    cy.get(userPage.password).type(password);
    cy.get(userPage.passConfirmField).type(password);
    cy.get(userPage.termsConditionsAccepted).check();
    cy.get(userPage.submit).click();
    cy.url().should('include', '/register/profile');

    cy.get(profilePage.dobCalendarBtn).click();
    cy.get(profilePage.yearButton).first().click();
    cy.get(profilePage.monthButton).first().click();
    cy.get(profilePage.dayButton).first().click();
    cy.get(profilePage.countrySelectOpen).click();
    cy.get(profilePage.countryInput).type('united kingdom');
    cy.get(profilePage.countryOption).first().click();
    cy.wait(5000); // Click the recaptcha!
    cy.get(profilePage.submit).click();

    cy.url().should('include', '/home');
    cy.get(homePage.menuUserName).first().invoke('text').should('eq', 'Namey McNameFace');
  });
  it('should logout', () => {
    cy.get(homePage.menuUserName).first().click();
    cy.get(homePage.menuLogout).first().click();

    cy.get(homePage.menuUserName).should('not.be.visible');
  });
  it('should login', () => {
    cy.visit('/login');
    cy.get(loginPage.email).type(uniqueEmail);
    cy.get(loginPage.password).type(password);
    cy.get(loginPage.login).click();

    cy.url().should('include', '/home');
    cy.get(homePage.menuUserName).first().invoke('text').should('eq', 'Namey McNameFace');
  });
});

