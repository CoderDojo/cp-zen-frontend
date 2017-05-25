var assert = require("assert");
var DojoListPage = require('../page-objects/dojo-list');

describe("The dojo list", function(){

  it("should list all the dojos", function(){

    DojoListPage.open();
    var dojosList = DojoListPage.dojoListItems;
    expect(dojosList.length).to.equal(3);
    expect(dojosList[0].getText()).to.equal("CD ROM");
    expect(dojosList[1].getText()).to.equal("Smithfield Awesome Dojo");
    expect(dojosList[2].getText()).to.equal("Dublin Ninja Kids");
  });

});
