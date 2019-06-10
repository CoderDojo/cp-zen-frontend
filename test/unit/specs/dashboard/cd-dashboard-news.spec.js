import vueUnitHelper from 'vue-unit-helper';
import DashboardNewsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-news';
import moment from 'moment';

describe('Dashboard children component', () => {
  let DashboardNewsComponentWithMocks;
  let MockUpdatesService;

  beforeEach(() => {
    MockUpdatesService = {
      loadForums: sinon.stub(),
      loadNews: sinon.stub(),
    };
    DashboardNewsComponentWithMocks = DashboardNewsComponent({
      './service': MockUpdatesService,
    });
  });

  afterEach(() => {
    sinon.restore();
  });


  describe('computed', () => {
    describe('computed.allPosts', () => {
      it('should return a list containing news posts', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [
        { date: '2018-08-09T10:00:00.000Z', link: 'blah1', title: { rendered: 'blah1' } },
        { date: '2018-08-10T10:00:00.000Z', link: 'blah2', title: { rendered: 'blah2' } },
        { date: '2018-08-11T10:00:00.000Z', link: 'blah3', title: { rendered: 'blah3' } },
        { date: '2018-08-12T10:00:00.000Z', link: 'blah4', title: { rendered: 'blah4' } },
        { date: '2018-08-13T10:00:00.000Z', link: 'blah5', title: { rendered: 'blah5' } },
        { date: '2018-08-14T10:00:00.000Z', link: 'blah6', title: { rendered: 'blah6' } },
        { date: '2018-08-15T10:00:00.000Z', link: 'blah7', title: { rendered: 'blah7' } }];

        vm.sortPostsByDate = sinon.stub().returns([
          { type: 'News', date: moment('2018-08-15T10:00:00.000Z'), formattedDate: '15/08/2018', link: 'blah7', title: 'blah7' },
          { type: 'News', date: moment('2018-08-14T10:00:00.000Z'), formattedDate: '14/08/2018', link: 'blah6', title: 'blah6' },
          { type: 'News', date: moment('2018-08-13T10:00:00.000Z'), formattedDate: '13/08/2018', link: 'blah5', title: 'blah5' },
          { type: 'News', date: moment('2018-08-12T10:00:00.000Z'), formattedDate: '12/08/2018', link: 'blah4', title: 'blah4' },
          { type: 'News', date: moment('2018-08-11T10:00:00.000Z'), formattedDate: '11/08/2018', link: 'blah3', title: 'blah3' },
          { type: 'News', date: moment('2018-08-10T10:00:00.000Z'), formattedDate: '10/08/2018', link: 'blah2', title: 'blah2' },
          { type: 'News', date: moment('2018-08-09T10:00:00.000Z'), formattedDate: '09/08/2018', link: 'blah1', title: 'blah1' }]);

        // ASSERT
        expect(vm.allPosts).to.deep.equal([
          { type: 'News', date: moment('2018-08-15T10:00:00.000Z'), formattedDate: '15/08/2018', link: 'blah7', title: 'blah7' },
          { type: 'News', date: moment('2018-08-14T10:00:00.000Z'), formattedDate: '14/08/2018', link: 'blah6', title: 'blah6' },
          { type: 'News', date: moment('2018-08-13T10:00:00.000Z'), formattedDate: '13/08/2018', link: 'blah5', title: 'blah5' },
          { type: 'News', date: moment('2018-08-12T10:00:00.000Z'), formattedDate: '12/08/2018', link: 'blah4', title: 'blah4' },
          { type: 'News', date: moment('2018-08-11T10:00:00.000Z'), formattedDate: '11/08/2018', link: 'blah3', title: 'blah3' },
          { type: 'News', date: moment('2018-08-10T10:00:00.000Z'), formattedDate: '10/08/2018', link: 'blah2', title: 'blah2' }]);
      });
      it('should return null if news is empty', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [];

        // ASSERT
        expect(vm.allPosts).to.equal(null);
      });
    });

    describe('computed.formattedNews', () => {
      it('should return a formatted array of news posts', () => {
        // ARRANGE
        const mockFormattedNews = [
        { type: 'News', date: moment('2018-08-09T10:00:00.000Z'), link: 'blah1', title: 'blah1' },
        { type: 'News', date: moment('2018-08-10T10:00:00.000Z'), link: 'blah2', title: 'blah2' },
        { type: 'News', date: moment('2018-08-11T10:00:00.000Z'), link: 'blah3', title: 'blah3' },
        { type: 'News', date: moment('2018-08-12T10:00:00.000Z'), link: 'blah4', title: 'blah4' },
        { type: 'News', date: moment('2018-08-13T10:00:00.000Z'), link: 'blah5', title: 'blah5' },
        { type: 'News', date: moment('2018-08-14T10:00:00.000Z'), link: 'blah6', title: 'blah6' },
        { type: 'News', date: moment('2018-08-15T10:00:00.000Z'), link: 'blah7', title: 'blah7' }];

        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [
        { date: '2018-08-09T10:00:00.000Z', link: 'blah1', title: { rendered: 'blah1' } },
        { date: '2018-08-10T10:00:00.000Z', link: 'blah2', title: { rendered: 'blah2' } },
        { date: '2018-08-11T10:00:00.000Z', link: 'blah3', title: { rendered: 'blah3' } },
        { date: '2018-08-12T10:00:00.000Z', link: 'blah4', title: { rendered: 'blah4' } },
        { date: '2018-08-13T10:00:00.000Z', link: 'blah5', title: { rendered: 'blah5' } },
        { date: '2018-08-14T10:00:00.000Z', link: 'blah6', title: { rendered: 'blah6' } },
        { date: '2018-08-15T10:00:00.000Z', link: 'blah7', title: { rendered: 'blah7' } }];

        // ASSERT
        expect(vm.formattedNews).to.deep.equal(mockFormattedNews);
      });
    });

    describe('computed.isDisplayable', () => {
      it('should return true if allPosts is not empty and the length of news is greater than 0', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [{ id: '1' }];
        vm.allPosts = [{ id: '1' }];

        // ASSERT
        expect(vm.isDisplayable).to.equal(true);
      });
      it('should return null if allPosts is empty and the length of news is not greater than 0', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [];
        vm.allPosts = null;

        // ASSERT
        expect(vm.isDisplayable).to.equal(null);
      });
    });
  });

  describe('methods', () => {
    describe('methods.loadNews', () => {
      it('should load the latest news', async () => {
        // ARRANGE
        const mockNews = [
        { date: '2018-08-09T', link: 'blah1', title: { rendered: 'blah1' } },
        { date: '2018-08-10T', link: 'blah2', title: { rendered: 'blah2' } },
        { date: '2018-08-11T', link: 'blah3', title: { rendered: 'blah3' } }];
        MockUpdatesService.loadNews.resolves({ body: mockNews });
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);

        // ACT
        await vm.loadNews(3);

        // ASSERT
        expect(vm.news).to.equal(mockNews);
      });
    });

    describe('methods.sortPostsByDate', () => {
      it('should sort the list of posts by date', async () => {
        // ARRANGE
        const posts = [
        { type: 'News', date: moment('2018-08-10T10:00:00.000Z'), link: 'blah2', title: 'blah2' },
        { type: 'News', date: moment('2018-08-12T10:00:00.000Z'), link: 'blah1', title: 'blah1' },
        { type: 'News', date: moment('2018-08-15T10:00:00.000Z'), link: 'blah3', title: 'blah3' }];
        const sortedPosts = [
        { formattedDate: '15/08/2018', type: 'News', date: moment('2018-08-15T10:00:00.000Z').utc(), link: 'blah3', title: 'blah3' },
        { formattedDate: '12/08/2018', type: 'News', date: moment('2018-08-12T10:00:00.000Z').utc(), link: 'blah1', title: 'blah1' },
        { formattedDate: '10/08/2018', type: 'News', date: moment('2018-08-10T10:00:00.000Z').utc(), link: 'blah2', title: 'blah2' }];

        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);

        // ACT
        const result = vm.sortPostsByDate(posts);

        // ASSERT
        expect(result).to.deep.equal(sortedPosts);
      });
    });

    describe('created', () => {
      it('should call each method to load the data', async () => {
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.loadNews = sinon.stub().resolves();
        // vm.loadForums = sinon.stub().resolves();
        vm.news = [];
        // vm.forums = [];

        await vm.$lifecycleMethods.created();
        expect(vm.loadNews).to.have.been.calledOnce;
        // expect(vm.loadForums).to.have.been.calledOnce;
      });
    });
  });
});
