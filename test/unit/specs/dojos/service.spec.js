import DojosService from 'inject-loader!@/dojos/service';
import Vue from 'vue';

describe('Dojos Service', () => {
  let sandbox;
  let MockGeolocationService;
  let DojosServiceWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockGeolocationService = {
      getIpCountryDetails: sandbox.stub(),
      geocode: sandbox.stub(),
    };
    DojosServiceWithMocks = DojosService({
      '@/geolocation/service': MockGeolocationService,
    }).default;
  });

  afterEach(() => {
    sandbox.restore();
  });

  const expectedResult = { name: 'Cool Dojo' };

  const expectedDojos = [{
    name: 'CD ROM',
    geoPoint: {
      lat: 53.349351,
      lon: -6.247585999999956,
    },
    stage: 0,
    urlSlug: 'ie/dublin/cd-rom',
    private: 1,
    id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
  }, {
    name: 'Smithfield Awesome Dojo',
    geoPoint: {
      lat: 53.34899189999999,
      lon: -6.278343100000029,
    },
    stage: 0,
    urlSlug: 'ie/smithfield/smithfield-awesome-dojo',
    private: 0,
    id: '4e591bbe-667b-4782-bc9c-180c6d321883',
  }, {
    name: 'Dublin Ninja Kids',
    geoPoint: {
      lat: 53.348315,
      lon: -6.248111999999992,
    },
    stage: 0,
    urlSlug: 'ie/dublin/dublin-ninja-kids',
    private: 1,
    id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
  }];

  const expectedDojosSnakeCase = [{
    name: 'CD ROM',
    geo_point: {
      lat: 53.349351,
      lon: -6.247585999999956,
    },
    stage: 0,
    url_slug: 'ie/dublin/cd-rom',
    private: 1,
    id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
  }, {
    name: 'Smithfield Awesome Dojo',
    geo_point: {
      lat: 53.34899189999999,
      lon: -6.278343100000029,
    },
    stage: 0,
    url_slug: 'ie/smithfield/smithfield-awesome-dojo',
    private: 0,
    id: '4e591bbe-667b-4782-bc9c-180c6d321883',
  }, {
    name: 'Dublin Ninja Kids',
    geo_point: {
      lat: 53.348315,
      lon: -6.248111999999992,
    },
    stage: 0,
    url_slug: 'ie/dublin/dublin-ninja-kids',
    private: 1,
    id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
  }];

  it('should call the api', (done) => {
    const httpStub = sandbox.stub(Vue.http, 'post');
    httpStub.withArgs(
      `${Vue.config.apiServer}/api/2.0/dojos/find`,
      {
        query: {
          urlSlug: 'aUrlSlug',
        },
      }).returns(Promise.resolve(expectedResult));

    DojosServiceWithMocks.getByUrlSlug('aUrlSlug').then((dojo) => {
      expect(dojo).to.deep.equal(expectedResult);
      done();
    });
  });

  describe('getDojos()', () => {
    it('should get dojos', (done) => {
      const query = { key: 'val' };
      const postMock = sandbox.stub(Vue.http, 'post');
      postMock.withArgs(`${Vue.config.apiServer}/api/2.0/dojos`, { query }).returns(Promise.resolve({ body: expectedDojos }));
      DojosServiceWithMocks.getDojos(query).then((res) => {
        expect(res.body).to.deep.equal(expectedDojos);
        done();
      });
    });
  });

  describe('getDojosByLatLong', () => {
    it('should get dojos by latitude and longitude', async () => {
      // ARRANGE
      const expectedQuery = {
        query: {
          lat: 10,
          lon: 89,
          radius: 50000,
        },
      };
      const postMock = sandbox.stub(Vue.http, 'post');
      postMock.withArgs(`${Vue.config.apiServer}/api/2.0/dojos/search-bounding-box`, expectedQuery).returns(Promise.resolve({ body: expectedDojosSnakeCase }));

      // ACT
      const response = await DojosServiceWithMocks.getDojosByLatLong(10, 89);

      // ASSERT
      expect(response.body).to.deep.equal(expectedDojos);
    });
  });

  describe('findDojoById', () => {
    it('should load dojo by ID', (done) => {
      const id = '3ed47c6d-a689-46a0-883b-1f3fd46e9c77';
      const expectedDojo = {
        id: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
        name: 'Dublin Ninja Kids',
      };

      const getMock = sandbox.stub(Vue.http, 'get');
      getMock.withArgs(`${Vue.config.apiServer}/api/2.0/dojos/${id}`).returns(Promise.resolve({ body: expectedDojo }));

      DojosServiceWithMocks.getDojoById(id).then((res) => {
        expect(res.body).to.deep.equal(expectedDojo);
        done();
      });
    });
  });

  describe('joinDojo', () => {
    it('should join a user to a dojo, based off userId, dojoId and roles', (done) => {
      // ARRANGE
      const userId = '74afa4b8-8449-46e4-a553-8febda8614ad';
      const dojoId = '4e591bbe-667b-4782-bc9c-180c6d321883';
      const userTypes = ['parent-guardian'];
      const expectedPayload = {
        userDojo: {
          owner: 0,
          userId,
          dojoId,
          userTypes,
        },
      };

      const postMock = sandbox.stub(Vue.http, 'post');
      postMock.withArgs(`${Vue.config.apiServer}/api/2.0/dojos/save-usersdojos`, expectedPayload).returns(Promise.resolve());

      // ACT
      DojosServiceWithMocks.joinDojo(userId, dojoId, userTypes)
        .then(() => {
          done();
        });
    });
  });

  describe('membership:request', () => {
    it('should request a user be joined to a dojo, given user, dojoId and userType', async () => {
      // ARRANGE
      const dojoId = 'd1';
      const userType = 'mentor';

      const postMock = sandbox.stub(Vue.http, 'post');

      // ACT
      await DojosServiceWithMocks.membership.request(dojoId, userType);
      expect(postMock).to.have.been.calledOnce
        .and.calledWith(`${Vue.config.apiServer}/api/3.0/dojos/d1/membership-requests`, { userType: 'mentor' });
    });
  });
  describe('membership:loadPending', () => {
    it('should transform a request to join into a membership', async () => {
       // ARRANGE
      const dojoId = 'd1';
      const requestId = 'rq1';

      const postMock = sandbox.stub(Vue.http, 'get');

      // ACT
      await DojosServiceWithMocks.membership.loadPending(requestId, dojoId);
      expect(postMock).to.have.been.calledOnce
        .and.calledWith(`${Vue.config.apiServer}/api/3.0/dojos/d1/membership-requests/rq1`);
    });
  });
  describe('membership:accept', () => {
    it('should transform a request to join into a membership', async () => {
      // ARRANGE
      const dojoId = 'd1';
      const requestId = 'rq1';

      const postMock = sandbox.stub(Vue.http, 'put');

      // ACT
      await DojosServiceWithMocks.membership.accept(requestId, dojoId);
      expect(postMock).to.have.been.calledOnce
        .and.calledWith(`${Vue.config.apiServer}/api/3.0/dojos/d1/membership-requests/rq1`);
    });
  });
  describe('membership:refuse', () => {
    it('should decline a membership request', async () => {
      // ARRANGE
      const dojoId = 'd1';
      const requestId = 'rq1';

      const postMock = sandbox.stub(Vue.http, 'delete');

      // ACT
      await DojosServiceWithMocks.membership.refuse(requestId, dojoId);
      expect(postMock).to.have.been.calledOnce
        .and.calledWith(`${Vue.config.apiServer}/api/3.0/dojos/d1/membership-requests/rq1`);
    });
  });
});
