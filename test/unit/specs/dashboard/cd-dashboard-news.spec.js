import vueUnitHelper from 'vue-unit-helper';
import DashboardNewsComponent from '!!vue-loader?inject!@/dashboard/cd-dashboard-news';

describe.only('Dashboard children component', () => {
  let sandbox;
  let DashboardNewsComponentWithMocks;
  let MockNewsForumsService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockNewsForumsService = {
      loadForums: sandbox.stub(),
      loadNews: sandbox.stub(),
    };
    DashboardNewsComponentWithMocks = DashboardNewsComponent({
      './service': MockNewsForumsService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('computed', () => {
    describe('computed.allPosts', () => {
      it('should return a list containing both news and forum posts', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = [
        { date: '2018-08-09T', link: 'blah1', title: { rendered: 'blah1' } },
        { date: '2018-08-10T', link: 'blah2', title: { rendered: 'blah2' } },
        { date: '2018-08-11T', link: 'blah3', title: { rendered: 'blah3' } }];
        vm.forums = [
        { timestampISO: '2018-08-12T', slug: 'blah1', title: 'blah1' },
        { timestampISO: '2018-08-13T', slug: 'blah2', title: 'blah2' },
        { timestampISO: '2018-08-114T', slug: 'blah3', title: 'blah3' },
        { timestampISO: '2018-08-15T', slug: 'blah4', title: 'blah4' }];
        vm.sortPostsByDate = sandbox.stub().returns([
          { type: 'Forums', date: '15/08/2018', link: 'https://forums.coderdojo.com/topic/blah4', title: 'blah4' },
          { type: 'Forums', date: '14/08/2018', link: 'https://forums.coderdojo.com/topic/blah3', title: 'blah3' },
          { type: 'Forums', date: '13/08/2018', link: 'https://forums.coderdojo.com/topic/blah2', title: 'blah2' },
          { type: 'Forums', date: '12/08/2018', link: 'https://forums.coderdojo.com/topic/blah1', title: 'blah1' },
          { type: 'News', date: '11/08/2018', link: 'blah3', title: 'blah3' },
          { type: 'News', date: '10/08/2018', link: 'blah2', title: 'blah2' },
          { type: 'News', date: '09/08/2018', link: 'blah1', title: 'blah1' }]);

        // ASSERT
        expect(vm.allPosts).to.deep.equal([
          { type: 'Forums', date: '15/08/2018', link: 'https://forums.coderdojo.com/topic/blah4', title: 'blah4' },
          { type: 'Forums', date: '14/08/2018', link: 'https://forums.coderdojo.com/topic/blah3', title: 'blah3' },
          { type: 'Forums', date: '13/08/2018', link: 'https://forums.coderdojo.com/topic/blah2', title: 'blah2' },
          { type: 'Forums', date: '12/08/2018', link: 'https://forums.coderdojo.com/topic/blah1', title: 'blah1' },
          { type: 'News', date: '11/08/2018', link: 'blah3', title: 'blah3' },
          { type: 'News', date: '10/08/2018', link: 'blah2', title: 'blah2' }]);
      });
      it('should return null if news and forum are empty', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.news = null;
        vm.forums = null;

        // ASSERT
        expect(vm.allPosts).to.equal(null);
      });
    });
    describe('computed.isDisplayable', () => {
      it('should return true if loadedPosts is true', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.loadedPosts = true;

        // ASSERT
        expect(vm.isDisplayable).to.equal(true);
      });
      it('should return false if loadedPosts is false', () => {
        // ARRANGE
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.loadedPosts = false;

        // ASSERT
        expect(vm.isDisplayable).to.equal(false);
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
        MockNewsForumsService.loadNews.returns(Promise.resolve({ body: mockNews }));
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);

        // ACT
        await vm.loadNews();

        // ASSERT
        expect(vm.news).to.equal(mockNews);
      });
    });

    describe('methods.loadForums', () => {
      it('should load the latest forums', async () => {
        // ARRANGE
        const mockForums = [
        { date: '2018-08-12T', slug: 'blah1', title: 'blah1' },
        { date: '2018-08-13T', slug: 'blah2', title: 'blah2' },
        { date: '2018-08-114T', slug: 'blah3', title: 'blah3' },
        { date: '2018-08-15T', slug: 'blah4', title: 'blah4' }];
        MockNewsForumsService.loadForums.returns(Promise.resolve({ body: { topics: mockForums } }));
        const vm = vueUnitHelper(DashboardNewsComponentWithMocks);
        vm.loadedPosts = false;

        // ACT
        await vm.loadForums();

        // ASSERT
        expect(vm.forums).to.equal(mockForums);
        expect(vm.loadedPosts).to.equal(true);
      });
    });

    describe('methods.sortPostsByDate', () => {
      it('should sort the list of posts by date', async () => {
        // ARRANGE
        const posts = [
        { type: 'Forums', date: '20180812', link: 'blah1', title: 'blah1' },
        { type: 'Forums', date: '20180810', link: 'blah2', title: 'blah2' },
        { type: 'Forums', date: '20180815', link: 'blah3', title: 'blah3' }];

        const sortedPosts = [
        { type: 'Forums', date: '15/08/2018', link: 'blah3', title: 'blah3' },
        { type: 'Forums', date: '12/08/2018', link: 'blah1', title: 'blah1' },
        { type: 'Forums', date: '10/08/2018', link: 'blah2', title: 'blah2' }];

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
        vm.loadForums = sinon.stub().resolves();
        vm.news = null;
        vm.forums = null;
        vm.loadedPosts = false;

        await vm.$lifecycleMethods.created();
        expect(vm.loadNews).to.have.been.calledOnce;
        expect(vm.loadForums).to.have.been.calledOnce;
      });
    });
  });
});
