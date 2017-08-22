const DojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDobVerificationPage = require('../page-objects/event-dob-verification');
const EventSessionsPage = require('../page-objects/event-sessions');
const LoginPage = require('../page-objects/login');
const FindDojoPage = require('../page-objects/find-dojo-page');

describe('Dojo details page', () => {
  it('should show dojo details', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();

    DojoDetailsPage.dojoImage.waitForVisible();

    const name = DojoDetailsPage.name.getText();
    expect(name).to.equal('Dublin Ninja Kids');

    const timeLabel = DojoDetailsPage.timeLabel.getText();
    expect(timeLabel).to.equal('TIME');

    const time = DojoDetailsPage.time.getText();
    expect(time).to.equal('Third Thursday of the month, 10am - 11:30am');

    const addressLabel = DojoDetailsPage.addressLabel.getText();
    expect(addressLabel).to.equal('LOCATION');

    const address = DojoDetailsPage.address.getText();
    expect(address).to.contain('CHQ Building,1 Custom House Quay, North Dock');

    const emailLabel = DojoDetailsPage.emailLabel.getText();
    expect(emailLabel).to.equal('EMAIL');

    const email = DojoDetailsPage.email.getText();
    expect(email).to.equal('dublinninjakids@gmail.com');

    const websiteLabel = DojoDetailsPage.websiteLabel.getText();
    expect(websiteLabel).to.equal('WEBSITE');

    const website = DojoDetailsPage.website.getText();
    expect(website).to.equal('www.dublinninjakids.com');

    const facebook = DojoDetailsPage.facebook;
    expect(facebook).to.equal('https://www.facebook.com/CoderDojo');

    const twitter = DojoDetailsPage.twitter;
    expect(twitter).to.equal('https://twitter.com/CoderDojo');

    const googleGroup = DojoDetailsPage.googleGroup;
    expect(googleGroup).to.equal('https://google.group.com/dublinninjakids');

    const detailsLabel = DojoDetailsPage.detailsLabel.getText();
    expect(detailsLabel).to.equal('Details');

    DojoDetailsPage.staticMap.waitForVisible();

    const details = DojoDetailsPage.details.getHTML(false);
    expect(details).to.equal('<p>This is the Dojo details section</p>\n');

    const sponsorLabel = DojoDetailsPage.sponsorHeading.getText();
    expect(sponsorLabel).to.equal('Dojo supported by');

    DojoDetailsPage.sponsorImage.waitForVisible();
  });

  it('should show dojo\'s events', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();

    const firstEventName = DojoDetailsPage.eventNames[0].getText();
    expect(firstEventName).to.equal('My First Amazing Event');
    expect(DojoDetailsPage.eventSessions[0].getText()).to.equal('Sessions: Scratch, Arduino');
    expect(DojoDetailsPage.eventDate(0).getText()).to.equal('September 6, 2017');
    expect(DojoDetailsPage.eventTimes(0).getText()).to.equal('4:30pm - 6pm');

    const secondEventName = DojoDetailsPage.eventNames[1].getText();
    expect(secondEventName).to.equal('My Second Amazing Event');
    expect(DojoDetailsPage.eventSessions[1].getText()).to.equal('Sessions: Raspberry Pi, Unity');
    expect(DojoDetailsPage.eventDateSeries[0].getText()).to.equal('Next in series:');
    expect(DojoDetailsPage.eventDate(1).getText()).to.equal('June 3, 2018');
    expect(DojoDetailsPage.eventTimes(1).getText()).to.equal('10am - 12pm');
    expect(DojoDetailsPage.eventRecurringInfoIcon[0].isVisible()).to.equal(true);
    expect(DojoDetailsPage.eventRecurringInfoHeader[0].getText()).to.equal('This is a recurring event');
    expect(DojoDetailsPage.eventRecurringInfoText[0].getText()).to.equal('Every two weeks on Sunday at 10am - 12pm, from June 3, 2018 to July 29, 2018');
  });

  it('should show message if no events are scheduled', () => {
    DojoPage.openDojoWithLatLong(10, 89, 0);
    DojoDetailsPage.name.waitForVisible();

    expect(DojoDetailsPage.noEventsHeader.getText()).to.equal('No Upcoming Events');
    expect(DojoDetailsPage.noEventsContent.getText()).to.equal('There are no upcoming events planned for this Dojo. Please email cdrom@example.com if you have any questions.');
  });

  it('should show event details after clicking on an event', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    expect(browser.getUrl()).to.have.string('/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');
    expect(EventSessionsPage.eventSessions[0].getText()).to.have.string('Scratch');
    expect(EventSessionsPage.eventSessions[0].getText()).to.have.string('Beginners welcome');
    expect(EventSessionsPage.eventTickets(0).getText()).to.have.string('Laptop Required');
    expect(EventSessionsPage.eventTickets(1).getText()).to.have.string('Parent');
    expect(EventSessionsPage.eventTickets(2).getText()).to.have.string('Mentor');
    expect(EventSessionsPage.eventTickets(3).getText()).to.have.string('Bringing a laptop');

    expect(EventSessionsPage.eventSessions[1].getText()).to.have.string('Arduino');
    expect(EventSessionsPage.eventSessions[1].getText()).to.have.string('Intermediate');
    expect(EventSessionsPage.eventTickets(4).getText()).to.have.string('Laptop required');

    expect(EventSessionsPage.ticketCounterValues.length).to.equal(8);
    EventSessionsPage.ticketCounterValues.forEach((counterValue) => {
      expect(counterValue.getValue()).to.equal('0');
    });

    EventSessionsPage.ticketCounterIncrement(0).click();
    expect(EventSessionsPage.ticketCounterValue(0).getValue()).to.equal('1');

    EventSessionsPage.ticketCounterIncrement(2).click();
    EventSessionsPage.ticketCounterIncrement(2).click();
    expect(EventSessionsPage.ticketCounterValue(2).getValue()).to.equal('2');

    EventSessionsPage.ticketCounterDecrement(2).click();
    expect(EventSessionsPage.ticketCounterValue(2).getValue()).to.equal('1');

    expect(EventSessionsPage.nextButton.isVisible()).to.equal(true);
    EventSessionsPage.nextButton.click();
    expect(browser.getUrl()).to.have.string('/events/d206004a-b0ce-4267-bf07-133e8113aa1b/book');
  });

  it('should not allow an underage person to proceed in the flow', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('25');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('5');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('2017');
    EventDobVerificationPage.verify.click();
    EventDobVerificationPage.dateOfBirthError.waitForVisible();
    expect(EventDobVerificationPage.dateOfBirthError.getText()).to.equal('You will need your parent to carry out the registration.');
  });

  it('should hide book button on private dojos when not logged in', () => {
    DojoPage.openDojoWithLatLong(10, 89, 3);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons.length).to.equal(0);

    const dojoUrl = browser.getUrl();

    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();

    FindDojoPage.header.waitForVisible();
    browser.url(dojoUrl);

    DojoDetailsPage.detailsLabel.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons.length).to.equal(2);
  });

  it('should hide book button on private dojos when logged in and not a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();

    DojoPage.openDojoWithLatLong(10, 89, 3);
    DojoDetailsPage.detailsLabel.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons.length).to.equal(0);
    browser.deleteCookie();
  });

  it('should show book button on private dojos when logged in and a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();

    DojoPage.openDojoWithLatLong(10, 89, 3);
    DojoDetailsPage.detailsLabel.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons.length).to.equal(2);
    browser.deleteCookie();
  });

  it('should hide book button if an event is a past event', () => {
    DojoPage.openDojoWithLatLong(10, 89, 1);
    DojoDetailsPage.name.waitForVisible();

    expect(DojoDetailsPage.eventViewButtons.length).to.equal(1);
  });

  it('should link to the dojo website', () => {
    DojoPage.openDojoWithLatLong(10, 89);

    DojoDetailsPage.website.waitForVisible();
    expect(DojoDetailsPage.website.getAttribute('href')).to.equal('http://www.dublinninjakids.com/');
  });

  it('should not show website label if dojo has no website', () => {
    DojoPage.openDojoWithLatLong(10, 89, 0);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.websiteLabel.isVisible()).to.equal(false);
  });

  it('should link to eventbrite for eventbrite events', () => {
    DojoPage.openDojoWithLatLong(10, 89, 4);

    DojoDetailsPage.firstEventViewButton.waitForVisible();
    expect((DojoDetailsPage.eventViewButtons[0]).getAttribute('href')).to.equal('http://www.eventbrite.com/');
  });

  it('should show all events when logged in and a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();

    DojoPage.openDojoWithLatLong(10, 89, 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(2);
    browser.deleteCookie();
  });

  it('should show only public events when not logged in', () => {
    DojoPage.openDojoWithLatLong(10, 89, 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(1);
  });

  it('should show only public events when logged in and not a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();

    DojoPage.openDojoWithLatLong(10, 89, 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(1);
    browser.deleteCookie();
  });

  it('should have a dropdown with manage functions for cdf-admin accounts', () => {
    DojoPage.openDojoWithLatLong(10, 89);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(false);
    const url = browser.getUrl();

    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('admin@coderdojo.org');
    LoginPage.password.setValue('cdfadmin');
    LoginPage.login.click();
    FindDojoPage.header.waitForVisible();
    browser.url(url);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(true);
    DojoDetailsPage.settingsDropdown.click();
    expect(DojoDetailsPage.editDojo.isVisible()).to.equal(true);
    expect(DojoDetailsPage.editDojo.getAttribute('href')).to.contain('/dashboard/edit-dojo/3ed47c6d-a689-46a0-883b-1f3fd46e9c77');
    expect(DojoDetailsPage.manageUsers.isVisible()).to.equal(true);
    expect(DojoDetailsPage.manageUsers.getAttribute('href')).to.contain('/dashboard/my-dojos/3ed47c6d-a689-46a0-883b-1f3fd46e9c77/users');
    expect(DojoDetailsPage.manageEvents.isVisible()).to.equal(true);
    expect(DojoDetailsPage.manageEvents.getAttribute('href')).to.contain('/dashboard/my-dojos/3ed47c6d-a689-46a0-883b-1f3fd46e9c77/events');
  });

  it('should show private notice on private Dojos', () => {
    DojoPage.openDojoWithLatLong(10, 89, 0);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.privateNotice.isVisible()).to.equal(true);
  });

  it('should show not private notice on public Dojos', () => {
    DojoPage.openDojoWithLatLong(10, 89, 2);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.privateNotice.isVisible()).to.equal(false);
  });

  it('should link to social media when given a username/handle', () => {
    DojoPage.openDojoWithLatLong(10, 89, 0);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.facebook).to.equal('https://facebook.com/DCU');
    expect(DojoDetailsPage.twitter).to.equal('https://twitter.com/CoderDojo');
  });

  it('should load Dojo details from a /dojos/:id URL', () => {
    DojoDetailsPage.open('3ed47c6d-a689-46a0-883b-1f3fd46e9c77');

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.name.getText()).to.equal('Dublin Ninja Kids');
  });

  describe('Mobile specific tests', () => {
    beforeEach(() => {
      DojoPage.openDojoWithLatLong(10, 89);
      DojoDetailsPage.name.waitForVisible();
      browser.setViewportSize({
        width: 320,
        height: 586,
      }); // iPhone 5 (smallest screen)
    });

    it('should show dojo details', () => {
      DojoDetailsPage.dojoImage.waitForVisible();

      const name = DojoDetailsPage.name.getText();
      expect(name).to.equal('Dublin Ninja Kids');

      const timeLabel = DojoDetailsPage.timeLabel.getText();
      expect(timeLabel).to.equal('TIME');

      const time = DojoDetailsPage.time.getText();
      expect(time).to.equal('Third Thursday of the month, 10am - 11:30am');

      const addressLabel = DojoDetailsPage.addressLabel.getText();
      expect(addressLabel).to.equal('LOCATION');

      const address = DojoDetailsPage.address.getText();
      expect(address).to.contain('CHQ Building,1 Custom House Quay, North Dock');

      const emailLabel = DojoDetailsPage.emailLabelMobile.getText();
      expect(emailLabel).to.equal('EMAIL');

      const email = DojoDetailsPage.emailMobile.getText();
      expect(email).to.equal('dublinninjakids@gmail.com');

      const websiteLabel = DojoDetailsPage.websiteLabelMobile.getText();
      expect(websiteLabel).to.equal('WEBSITE');

      const website = DojoDetailsPage.websiteMobile.getText();
      expect(website).to.equal('www.dublinninjakids.com');

      const facebook = DojoDetailsPage.facebookMobile;
      expect(facebook).to.equal('https://www.facebook.com/CoderDojo');

      const twitter = DojoDetailsPage.twitterMobile;
      expect(twitter).to.equal('https://twitter.com/CoderDojo');

      const googleGroup = DojoDetailsPage.googleGroupMobile;
      expect(googleGroup).to.equal('https://google.group.com/dublinninjakids');

      const detailsLabel = DojoDetailsPage.detailsLabel.getText();
      expect(detailsLabel).to.equal('Details');

      const details = DojoDetailsPage.details.getHTML(false);
      expect(details).to.equal('<p>This is the Dojo details section</p>\n');

      const sponsorLabel = DojoDetailsPage.sponsorHeading.getText();
      expect(sponsorLabel).to.equal('Dojo supported by');

      DojoDetailsPage.sponsorImage.waitForVisible();
    });

    it('should link to the dojo website', () => {
      DojoPage.openDojoWithLatLong(10, 89);

      DojoDetailsPage.websiteMobile.waitForVisible();
      expect(DojoDetailsPage.websiteMobile.getAttribute('href')).to.equal('http://www.dublinninjakids.com/');
    });
  });
});
