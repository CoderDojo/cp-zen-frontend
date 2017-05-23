var assert = require('assert');


describe('new zen', function() {
  it('should show \'vue.js\' on the welcome page', function () {
    browser.url('http://localhost:8080/');
    var title = browser.getTitle();
    assert.equal(title, 'cp-zen-frontend');
  });
});



