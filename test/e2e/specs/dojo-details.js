const FindDojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const EventDobVerificationPage = require('../page-objects/event-dob-verification');
const EventSessionsPage = require('../page-objects/event-sessions');
const LoginPage = require('../page-objects/login');
const currentYear = (new Date()).getFullYear();

describe('Dojo details page', () => {
  it('should show dojo details', () => {
    FindDojoPage.openDojoWithQuery('dublin');
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
    FindDojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();

    const firstEventName = DojoDetailsPage.eventNames[0].getText();
    expect(firstEventName).to.equal('My First Amazing Event');
    expect(DojoDetailsPage.eventSessions[0].getText()).to.equal('Sessions: Scratch, Arduino');
    expect(DojoDetailsPage.eventDate(0).getText()).to.equal(`September 6, ${currentYear + 1}`);
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
    FindDojoPage.openDojoWithQuery('dublin', 0);
    DojoDetailsPage.name.waitForVisible();

    expect(DojoDetailsPage.noEventsHeader.getText()).to.equal('No Listed Events');
    expect(DojoDetailsPage.noEventsContent[0].getText()).to.equal('This Dojo may list their events on another website or they may encourage people to attend without booking.');
    expect(DojoDetailsPage.noEventsContent[1].getText()).to.equal('Please email the Dojo on cdrom@example.com to find out about their upcoming events.');

    FindDojoPage.openDojoWithQuery('dublin', 5);
    DojoDetailsPage.name.waitForVisible();

    expect(DojoDetailsPage.noEventsContent[0].getText()).to.equal('This Dojo may list their events on another website or they may encourage people to attend without booking.');
    expect(DojoDetailsPage.noEventsContent[1].getText()).to.equal('Please join this Dojo for updates and email the Dojo on asudojo@example.com to find out about their upcoming events.');

    expect(DojoDetailsPage.detailsLabel[1]).to.not.equal('Recent Events');
  });

  it('should show event details after clicking on an event', () => {
    FindDojoPage.openDojoWithQuery('dublin');
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

  it('should show an error if no tickets are selected', () => {
    FindDojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('27');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('3');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('1980');
    EventDobVerificationPage.verify.click();

    expect(browser.getUrl()).to.have.string('/events/d206004a-b0ce-4267-bf07-133e8113aa1b/sessions');

    expect(EventSessionsPage.ticketCounterValues.length).to.equal(8);
    EventSessionsPage.ticketCounterValues.forEach((counterValue) => {
      expect(counterValue.getValue()).to.equal('0');
    });

    expect(EventSessionsPage.nextButton.isVisible()).to.equal(true);
    EventSessionsPage.nextButton.click();
    expect(EventSessionsPage.noTicketSelectedError.getText()).to.equal('Please select at least one ticket');
  });

  it('should not allow an underage person to proceed in the flow', () => {
    FindDojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    DojoDetailsPage.eventViewButtons[0].click();

    EventDobVerificationPage.dateOfBirthDayInput.selectByValue('25');
    EventDobVerificationPage.dateOfBirthMonthInput.selectByValue('5');
    EventDobVerificationPage.dateOfBirthYearInput.selectByValue('2017');
    EventDobVerificationPage.verify.click();
    EventDobVerificationPage.dateOfBirthError.waitForVisible();
    expect(EventDobVerificationPage.dateOfBirthError.getText()).to.equal('You will need your parent to carry out the registration.');
  });

  it('should hide book button on private dojos when not logged in', () => {
    FindDojoPage.openDojoWithQuery('dublin', 3);
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
    browser.deleteCookie();
  });

  it('should hide book button on private dojos when logged in and not a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();

    FindDojoPage.openDojoWithQuery('dublin', 3);
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

    FindDojoPage.openDojoWithQuery('dublin', 3);
    DojoDetailsPage.detailsLabel.waitForVisible();
    DojoDetailsPage.firstEventViewButton.waitForVisible();
    expect(DojoDetailsPage.eventViewButtons.length).to.equal(2);
    browser.deleteCookie();
  });

  it('should hide book button if an event is a past event', () => {
    FindDojoPage.openDojoWithQuery('dublin', 1);
    DojoDetailsPage.name.waitForVisible();

    expect(DojoDetailsPage.eventViewButtons.length).to.equal(1);
  });

  it('should link to the dojo website', () => {
    FindDojoPage.openDojoWithQuery('dublin');

    DojoDetailsPage.website.waitForVisible();
    expect(DojoDetailsPage.website.getAttribute('href')).to.equal('http://www.dublinninjakids.com/');
  });

  it('should not show website label if dojo has no website', () => {
    FindDojoPage.openDojoWithQuery('dublin', 0);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.websiteLabel.isVisible()).to.equal(false);
  });

  it('should link to eventbrite for eventbrite events', () => {
    FindDojoPage.openDojoWithQuery('dublin', 4);

    DojoDetailsPage.firstEventViewButton.waitForVisible();
    expect((DojoDetailsPage.eventViewButtons[0]).getAttribute('href')).to.equal('http://www.eventbrite.com/');
  });

  it('should show all events when logged in and a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('testparent1');
    LoginPage.login.click();

    FindDojoPage.openDojoWithQuery('dublin', 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(2);
    browser.deleteCookie();
  });

  it('should show only public events when not logged in', () => {
    FindDojoPage.openDojoWithQuery('dublin', 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(1);
  });

  it('should show only public events when logged in and not a member of the dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();

    FindDojoPage.openDojoWithQuery('dublin', 3);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.eventNames.length).to.equal(1);
    browser.deleteCookie();
  });
  
  it('should show past events when there is no upcoming events and not joined', () => {
    FindDojoPage.openDojoWithQuery('dublin&p=2', 2);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.noEventsPastContent[0].getText()).to.equal('This Dojo had events recently. Join the Dojo to get notified when tickets for the next event are available.');
  });
  
  it('should show past events when there is no upcoming events and joined', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent2@example.com');
    LoginPage.password.setValue('testparent2');
    LoginPage.login.click();
 
    FindDojoPage.openDojoWithQuery('dublin&p=2', 2);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.noEventsPastContent[0].getText()).to.equal('This Dojo had events recently. You\'ll be notified when tickets for the next event are available.');
    browser.deleteCookie();
  });

  it('should show private notice on private Dojos', () => {
    FindDojoPage.openDojoWithQuery('dublin', 0);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.privateNotice.isVisible()).to.equal(true);
  });

  it('should show not private notice on public Dojos', () => {
    FindDojoPage.openDojoWithQuery('dublin', 2);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.privateNotice.isVisible()).to.equal(false);
  });

  it('should link to social media when given a username/handle', () => {
    FindDojoPage.openDojoWithQuery('dublin', 0);

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.facebook).to.equal('https://facebook.com/DCU');
    expect(DojoDetailsPage.twitter).to.equal('https://twitter.com/CoderDojo');
  });

  it('should load Dojo details from a /dojos/:id URL', () => {
    DojoDetailsPage.open('3ed47c6d-a689-46a0-883b-1f3fd46e9c77');

    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.name.getText()).to.equal('Dublin Ninja Kids');
  });

  it('should not show volunteering section to non logged in user', () => {
    FindDojoPage.openDojoWithQuery('dublin', 2);
    DojoDetailsPage.sponsorImage.waitForVisible();

    expect(DojoDetailsPage.mentorVolunteerButton).to.equal(undefined);
  });

  it('should allow a logged in user to volunteer at a public dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('password1');
    LoginPage.login.click();
    FindDojoPage.header.waitForVisible();

    FindDojoPage.openDojoWithQuery('dublin', 2);
    DojoDetailsPage.mentorVolunteerButton.waitForVisible();
    DojoDetailsPage.mentorVolunteerButton.click();
    browser.pause(500); // Wait for alert to be displayed
    expect(browser.alertText()).to.equal('The Champion of this Dojo has been notified that you want to volunteer.');
    browser.alertAccept();

    browser.deleteCookie();
  });

  it('should not allow a logged in user to volunteer at a private dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('password1');
    LoginPage.login.click();
    FindDojoPage.header.waitForVisible();

    FindDojoPage.openDojoWithQuery('dublin', 0);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.mentorVolunteerButton).to.equal(undefined);

    browser.deleteCookie();
  });

  it('should allow to join a public dojo when there are events', () => {
    FindDojoPage.openDojoWithQuery('dublin', 2);
    DojoDetailsPage.name.waitForVisible();
    expect(DojoDetailsPage.joinButtonWEvents.isVisible()).to.equal(true);
  });

  it('should allow a logged-out user to join a public dojo', () => {
    FindDojoPage.openDojoWithQuery('dublin', 5);
    expect(DojoDetailsPage.joinButtonNoEvents.isVisible()).to.equal(true);
    // TODO : test redirection to login when login is implemented in vue
  });

  it('should allow a logged in user to join a public dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('password1');
    LoginPage.login.click();
    FindDojoPage.header.waitForVisible();

    FindDojoPage.openDojoWithQuery('dublin', 5);
    DojoDetailsPage.joinButtonNoEvents.waitForVisible();
    DojoDetailsPage.joinButtonNoEvents.click();
    expect(browser.alertText()).to.equal('Congratulations, you have now joined the Dojo.');
    browser.alertAccept();

    browser.deleteCookie();
  });

  it('should not allow someone to join a private dojo', () => {
    LoginPage.open();
    LoginPage.email.waitForVisible();
    LoginPage.email.setValue('parent1@example.com');
    LoginPage.password.setValue('password1');
    LoginPage.login.click();
    FindDojoPage.header.waitForVisible();

    FindDojoPage.openDojoWithQuery('dublin', 0);
    expect(DojoDetailsPage.joinButtonNoEvents.isVisible()).to.equal(false);

    browser.deleteCookie();
  });

  describe('Dojo admin actions', () => {
    it('should have a dropdown with manage functions for cdf-admin accounts', () => {
      FindDojoPage.openDojoWithQuery('dublin', 3);
      DojoDetailsPage.name.waitForVisible();
      expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(false);
      const url = browser.getUrl();

      LoginPage.open();
      LoginPage.email.waitForVisible();
      LoginPage.email.setValue('admin@coderdojo.org');
      LoginPage.password.setValue('cdfadmin1');
      LoginPage.login.click();
      FindDojoPage.header.waitForVisible();
      browser.url(url);

      DojoDetailsPage.name.waitForVisible();
      DojoDetailsPage.settingsDropdown.waitForVisible();
      DojoDetailsPage.settingsDropdown.click();
      expect(DojoDetailsPage.editDojo.isVisible()).to.equal(true);
      expect(DojoDetailsPage.editDojo.getAttribute('href')).to.contain('/dashboard/edit-dojo/70e868a9-f2b2-4b73-8f83-7e3a79dfa150');
      expect(DojoDetailsPage.manageUsers.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageUsers.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/users');
      expect(DojoDetailsPage.manageEvents.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageEvents.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/events');
      browser.deleteCookie();
    });

    it('should have a dropdown with manage functions for members with dojo-admin and ticketing-admin', () => {
      FindDojoPage.openDojoWithQuery('dublin', 3);
      DojoDetailsPage.name.waitForVisible();
      expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(false);
      const url = browser.getUrl();

      LoginPage.open();
      LoginPage.email.waitForVisible();
      LoginPage.email.setValue('champion1@example.com');
      LoginPage.password.setValue('testchampion1');
      LoginPage.login.click();
      FindDojoPage.header.waitForVisible();
      browser.url(url);

      DojoDetailsPage.name.waitForVisible();
      DojoDetailsPage.settingsDropdown.waitForVisible();
      DojoDetailsPage.settingsDropdown.click();
      expect(DojoDetailsPage.editDojo.isVisible()).to.equal(true);
      expect(DojoDetailsPage.editDojo.getAttribute('href')).to.contain('/dashboard/edit-dojo/70e868a9-f2b2-4b73-8f83-7e3a79dfa150');
      expect(DojoDetailsPage.manageUsers.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageUsers.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/users');
      expect(DojoDetailsPage.manageEvents.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageEvents.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/events');
      browser.deleteCookie();
    });

    it('should have a dropdown with manage dojo functions for members with only dojo-admin', () => {
      FindDojoPage.openDojoWithQuery('dublin', 3);
      DojoDetailsPage.name.waitForVisible();
      expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(false);
      const url = browser.getUrl();

      LoginPage.open();
      LoginPage.email.waitForVisible();
      LoginPage.email.setValue('mentor1@example.com');
      LoginPage.password.setValue('testmentor1');
      LoginPage.login.click();
      FindDojoPage.header.waitForVisible();
      browser.url(url);

      DojoDetailsPage.name.waitForVisible();
      DojoDetailsPage.settingsDropdown.waitForVisible();
      DojoDetailsPage.settingsDropdown.click();
      expect(DojoDetailsPage.editDojo.isVisible()).to.equal(true);
      expect(DojoDetailsPage.editDojo.getAttribute('href')).to.contain('/dashboard/edit-dojo/70e868a9-f2b2-4b73-8f83-7e3a79dfa150');
      expect(DojoDetailsPage.manageUsers.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageUsers.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/users');
      expect(DojoDetailsPage.manageEvents.isVisible()).to.equal(false);
      browser.deleteCookie();
    });

    it('should have a dropdown with manage events function for members with only ticketing-admin', () => {
      FindDojoPage.openDojoWithQuery('dublin', 3);
      DojoDetailsPage.name.waitForVisible();
      expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(false);
      const url = browser.getUrl();

      LoginPage.open();
      LoginPage.email.waitForVisible();
      LoginPage.email.setValue('parent1@example.com');
      LoginPage.password.setValue('testparent1');
      LoginPage.login.click();
      FindDojoPage.header.waitForVisible();
      browser.url(url);

      DojoDetailsPage.name.waitForVisible();
      expect(DojoDetailsPage.settingsDropdown.isVisible()).to.equal(true);
      DojoDetailsPage.settingsDropdown.click();
      expect(DojoDetailsPage.editDojo.isVisible()).to.equal(false);
      expect(DojoDetailsPage.manageUsers.isVisible()).to.equal(false);
      expect(DojoDetailsPage.manageEvents.isVisible()).to.equal(true);
      expect(DojoDetailsPage.manageEvents.getAttribute('href')).to.contain('/dashboard/my-dojos/70e868a9-f2b2-4b73-8f83-7e3a79dfa150/events');
      browser.deleteCookie();
    });
  });

  describe('Mobile specific tests', () => {
    beforeEach(() => {
      FindDojoPage.openDojoWithQuery('dublin');
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
      FindDojoPage.openDojoWithQuery('dublin');

      DojoDetailsPage.websiteMobile.waitForVisible();
      expect(DojoDetailsPage.websiteMobile.getAttribute('href')).to.equal('http://www.dublinninjakids.com/');
    });
  });
});
