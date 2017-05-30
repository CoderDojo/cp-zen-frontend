const DojoDetailsPage = require('../page-objects/dojo-details');

describe('Dojo details page', () => {
  it('should show dojo details', () => {
    DojoDetailsPage.open('ie/dublin/dublin-ninja-kids');
    DojoDetailsPage.name.waitForVisible();

    const name = DojoDetailsPage.name.getText();
    expect(name).to.equal('Dublin Ninja Kids');

    const time = DojoDetailsPage.time.getText();
    expect(time).to.equal('Saturdays 11 am - 1 pm');

    const address = DojoDetailsPage.address.getText();
    expect(address).to.equal('CHQ Building,1 Custom House Quay, North Dock, Dublin, Ireland');

    const details = DojoDetailsPage.details.getHTML(false);
    expect(details).to.equal('<p>This is the Dojo details section</p>\n');

    const email = DojoDetailsPage.email.getText();
    expect(email).to.equal('dublinninjakids@gmail.com');

    const website = DojoDetailsPage.website.getText();
    expect(website).to.equal('www.dublinninjakids.com');

    const facebook = DojoDetailsPage.facebook.getText();
    expect(facebook).to.equal('https://www.facebook.com/CoderDojo');

    const twitter = DojoDetailsPage.twitter.getText();
    expect(twitter).to.equal('https://twitter.com/CoderDojo');

    const googleGroup = DojoDetailsPage.googleGroup.getText();
    expect(googleGroup).to.equal('dublinninjakids@google.group.com');
  });
});
