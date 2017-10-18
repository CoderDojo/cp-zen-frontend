import vueUnitHelper from 'vue-unit-helper';
import dojoDetails from '!!vue-loader?inject!@/dojos/cd-dojo-details';

describe('Dojo details component', () => {
  let sandbox;
  let DojoDetailsWithMocks;
  let DojoServiceMock;
  let UsersDojosServiceMock;
  let UsersDojosUtilMock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    DojoServiceMock = {
      getDojoById: sandbox.stub(),
      getByUrlSlug: sandbox.stub(),
      requestUserInvite: sandbox.stub(),
    };
    UsersDojosServiceMock = {
      getUsersDojos: sandbox.stub(),
    };
    UsersDojosUtilMock = {
      hasPermission: sandbox.stub(),
    };
    DojoDetailsWithMocks = dojoDetails({
      './service': DojoServiceMock,
      '@/usersDojos/service': UsersDojosServiceMock,
      '@/usersDojos/util': UsersDojosUtilMock,
    });
  });

  const dojoDetailsWithAddress =
    {
      id: 1,
      name: 'Dublin Ninja Kids',
      location: 'Dublin',
      address1: 'CHQ',
      placeName: 'Dublin',
      countryName: 'Ireland',
    };

  describe('methods.loadDojoDetails', () => {
    it('should show dojo details from urlSlug', async () => {
      DojoServiceMock.getByUrlSlug.withArgs('za/gauteng/johannesburg-rock-stars').returns(Promise.resolve({ body: dojoDetailsWithAddress }));
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.id = undefined;
      vm.urlSlug = 'za/gauteng/johannesburg-rock-stars';
      sandbox.stub(vm, 'redirectToSlug');

      await vm.loadDojoDetails();

      expect(DojoServiceMock.getByUrlSlug).to.have.been.calledOnce;
      expect(DojoServiceMock.getDojoById).to.have.not.been.called;
      expect(vm.redirectToSlug).to.have.not.been.called;
      expect(vm.dojoDetails).to.deep.equal(dojoDetailsWithAddress);
    });

    it('should show dojo details from id', async () => {
      DojoServiceMock.getDojoById.withArgs('foo').returns(Promise.resolve({ body: dojoDetailsWithAddress }));
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.id = 'foo';
      sandbox.stub(vm, 'redirectToSlug');

      await vm.loadDojoDetails();

      expect(DojoServiceMock.getByUrlSlug).to.have.not.been.called;
      expect(DojoServiceMock.getDojoById).to.have.been.calledOnce;
      expect(vm.redirectToSlug).to.have.been.calledOnce;
      expect(vm.dojoDetails).to.deep.equal(dojoDetailsWithAddress);
    });
  });

  describe('methods.redirectToSlug', () => {
    it('should replace the current router state with the urlSlug', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.$router = {
        replace: sandbox.stub(),
      };
      vm._country = 'ie';
      vm._path = 'dublin/docklands';

      // ACT
      vm.redirectToSlug();

      // ASSERT
      expect(vm.$router.replace).to.have.been.calledOnce;
      expect(vm.$router.replace).to.have.been.calledWith({
        name: 'DojoDetails',
        params: {
          country: 'ie',
          path: ['dublin', 'docklands'],
        },
      });
    });
  });

  describe('methods.volunteer', () => {
    it('should volunteer logged in user as given user type at current Dojo', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      const userType = 'mentor';
      vm.user = {
        id: '74afa4b8-8449-46e4-a553-8febda8614ad',
      };
      vm.dojoDetails = {
        id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      };

      // ACT
      vm.volunteer(userType);

      // ASSERT
      expect(DojoServiceMock.requestUserInvite).to
        .have.been.calledWith(vm.user, vm.dojoDetails.id, userType);
    });
  });

  describe('computed.urlSlug', () => {
    it('should build the urlSlug from path parameters', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm._country = 'za';
      vm._path = 'gauteng/johannesburg-rock-stars';

      // ASSERT
      expect(vm.urlSlug).to.equal('za/gauteng/johannesburg-rock-stars');
    });

    it('should update _country and _path from given value', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm._country = 'za';
      vm._path = 'gauteng/johannesburg-rock-stars';

      // ACT
      vm.urlSlug = 'ie/dublin/docklands';

      // ASSERT
      expect(vm._country).to.equal('ie');
      expect(vm._path).to.equal('dublin/docklands');
    });

    it('should update _country and _path from given value', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm._country = 'za';
      vm._path = 'gauteng/johannesburg-rock-stars';

      // ACT
      vm.urlSlug = null;

      // ASSERT
      expect(vm._country).to.equal(null);
      expect(vm._path).to.equal(null);
    });
  });

  it('should compute an image url for given dojo id', async () => {
    // ARRANGE
    DojoServiceMock.getByUrlSlug.returns(Promise.resolve({ body: dojoDetailsWithAddress }));
    const vm = vueUnitHelper(DojoDetailsWithMocks);

    // ACT
    await vm.loadDojoDetails();

    // ASSERT
    expect(vm.imageUrl).to.equal(`https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${dojoDetailsWithAddress.id}`);
  });

  describe('computed.address()', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(dojoDetails());
    });

    it('should return undefined when address1 and placeName are falsey', () => {
      vm.dojoDetails = {};
      expect(vm.address).to.be.undefined;
    });

    it('should return address1 when address1 is truthy', () => {
      vm.dojoDetails = {
        address1: 'CHQ, Dublin, Ireland',
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      expect(vm.address).to.equal('CHQ, Dublin, Ireland');
    });

    it('should return placeName when address1 is falsey and placeName is truthy', () => {
      vm.dojoDetails = {
        address1: null,
        placeName: 'Dublin',
        countryName: 'Ireland',
      };
      expect(vm.address).to.equal('Dublin');
    });
  });

  describe('computed.googleMapsLink', () => {
    it('should return a link to google maps with the Dojos lat and long', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.dojoDetails = {
        geoPoint: {
          lat: 53.349351,
          lon: -6.247585999999956,
        },
      };

      // ASSERT
      expect(vm.googleMapsLink).to.equal('https://www.google.com/maps/search/?api=1&query=53.349351,-6.247585999999956');
    });
  });

  describe('computed.isCDFAdmin', () => {
    it('should return true when the logged in user is a CDF admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {
        roles: ['cdf-admin'],
      };

      // ASSERT
      expect(vm.isCDFAdmin).to.equal(true);
    });

    it('should return false when user is null', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = null;

      // ASSERT
      expect(vm.isCDFAdmin).to.equal(false);
    });

    it('should return false when the logged in user is not a CDF admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {
        roles: ['basic-user'],
      };

      // ASSERT
      expect(vm.isCDFAdmin).to.equal(false);
    });

    it('should return false when the logged in user has no roles', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      vm.user = {};

      // ASSERT
      expect(vm.isCDFAdmin).to.equal(false);
    });
  });

  describe('computed.isDojoAdmin', () => {
    it('should return call to hasPermission with the usersDojos and dojo-admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      const mockUsersDojos = [{ name: 'dojo-admin' }];
      UsersDojosUtilMock.hasPermission.withArgs(mockUsersDojos, 'dojo-admin').returns('yup');
      vm.usersDojos = mockUsersDojos;

      // ASSERT
      expect(vm.isDojoAdmin).to.equal('yup');
    });
  });

  describe('computed.isTicketingAdmin', () => {
    it('should return call to hasPermission with the usersDojos and ticketing-admin', () => {
      // ARRANGE
      const vm = vueUnitHelper(DojoDetailsWithMocks);
      const mockUsersDojos = [{ name: 'ticketing-admin' }];
      UsersDojosUtilMock.hasPermission.withArgs(mockUsersDojos, 'ticketing-admin').returns('yup');
      vm.usersDojos = mockUsersDojos;

      // ASSERT
      expect(vm.isTicketingAdmin).to.equal('yup');
    });
  });

  describe('computed.buildTwitterLink', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(dojoDetails());
    });

    it('should return a formatted url from a twitter handle', () => {
      // ARRANGE
      vm.dojoDetails = {
        twitter: '@CoderDojo',
      };

      // ACT & ASSERT
      expect(vm.buildTwitterLink).to.equal('https://twitter.com/@CoderDojo');

      // ARRANGE
      vm.dojoDetails = {
        twitter: 'CoderDojo',
      };

      // ACT & ASSERT
      expect(vm.buildTwitterLink).to.equal('https://twitter.com/CoderDojo');
    });
    it('should return a url if one is supplied', () => {
      // ARRANGE
      vm.dojoDetails = {
        twitter: 'http://twitter.com/twitter',
      };

      // ACT & ASSERT
      expect(vm.buildTwitterLink).to.equal('http://twitter.com/twitter');
    });
  });

  describe('computed.buildFacebookLink', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(dojoDetails());
    });

    it('should return a formatted url from a facebook username', () => {
      // ARRANGE
      vm.dojoDetails = {
        facebook: 'CoderDojo',
      };

      // ACT & ASSERT
      expect(vm.buildFacebookLink).to.equal('https://facebook.com/CoderDojo');

      // ARRANGE
      vm.dojoDetails = {
        facebook: '.',
      };

      // ACT & ASSERT
      expect(vm.buildFacebookLink).to.equal('https://facebook.com/.');
    });
    it('should return a url if one is supplied', () => {
      // ARRANGE
      vm.dojoDetails = {
        facebook: 'http://facebook.com/DCU',
      };

      // ACT & ASSERT
      expect(vm.buildFacebookLink).to.equal('http://facebook.com/DCU');
    });
  });

  describe('methods.loadUserDojoRelationship', () => {
    let vm;

    beforeEach(() => {
      vm = vueUnitHelper(DojoDetailsWithMocks);
    });

    it('should get the usersDojos if user.id exists and assign to usersDojos', async () => {
      // ARRANGE
      vm.user = { id: 'asdf' };
      vm.dojoDetails = { id: 'qwer' };
      UsersDojosServiceMock.getUsersDojos.withArgs('asdf', 'qwer').returns({ body: 'yup' });

      // ACT
      await vm.loadUserDojoRelationship();

      // ASSERT
      expect(vm.usersDojos).to.equal('yup');
    });

    it('should not get the usersDojos if user.id does not exist', async () => {
      // ARRANGE
      vm.user = {};
      vm.usersDojos = 'nope';

      // ACT
      await vm.loadUserDojoRelationship();

      // ASSERT
      expect(UsersDojosServiceMock.getUsersDojos).to.not.have.been.called;
      expect(vm.usersDojos).to.equal('nope');
    });
  });
});
