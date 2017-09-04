import Vue from 'vue';
import vueUnitHelper from 'vue-unit-helper';
import cdDojoList from '!!vue-loader?inject!@/dojos/cd-dojo-list';

describe('The Dojo List vue ', () => {
  let vm;
  let sandbox;
  let DojoListWithMocks;
  let DojoPaginationStoreMock;
  let VuePaginationMock;

  const mockDojos = [{
    id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-68fj-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-hm4f-4e3a-imh3-d076c94946c6',
  },
  {
    id: 'b850b40e-dc34-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-jn56-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-4b6c-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-99mj-4e3a-8a46-d076c94946c6',
  },
  {
    id: 'b850b40e-j213-4e3a-8a46-d076c94946c6',
  }];

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    DojoPaginationStoreMock = {
      commit: sandbox.stub(),
      state: {
        dojosPerPage: 6,
      },
    };
    VuePaginationMock = {
      Pagination: {},
      PaginationEvent: {
        $on: sandbox.stub(),
      },
    };
    DojoListWithMocks = cdDojoList({
      'vue-pagination-2': VuePaginationMock,
      './dojo-pagination-store': DojoPaginationStoreMock,
    });
    vm = vueUnitHelper(DojoListWithMocks);
  });

  describe('computed property', () => {
    describe('paginatedDojos', () => {
      it('should return the right Dojos and the right amount for the current page', () => {
        // ARRANGE
        vm.dojos = mockDojos;
        vm.currentPage = 1;

        // ACT & ASSERT
        expect(vm.paginatedDojos).to.deep.equal([{
          id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
        },
        {
          id: 'b850b40e-68fj-4e3a-8a46-d076c94946c6',
        },
        {
          id: 'b850b40e-hm4f-4e3a-imh3-d076c94946c6',
        },
        {
          id: 'b850b40e-dc34-4e3a-8a46-d076c94946c6',
        },
        {
          id: 'b850b40e-jn56-4e3a-8a46-d076c94946c6',
        },
        {
          id: 'b850b40e-4b6c-4e3a-8a46-d076c94946c6',
        }]);
        expect((vm.paginatedDojos).length).to.equal(6);

        // ARRANGE
        vm.currentPage = 2;

        // ACT & ASSERT
        expect(vm.paginatedDojos).to.deep.equal([{
          id: 'b850b40e-99mj-4e3a-8a46-d076c94946c6',
        },
        {
          id: 'b850b40e-j213-4e3a-8a46-d076c94946c6',
        }]);
        expect((vm.paginatedDojos).length).to.equal(2);
      });
    });
  });

  describe('method', () => {
    describe('goToPage()', () => {
      it('should add a p query to the URL of the page it is passed', () => {
        // ARRANGE
        vm.$route = {
          query: {
            q: 'dublin',
          },
        };

        vm.$router = {
          push: sandbox.spy(),
        };

        // ACT
        vm.goToPage(2);

        // ASSERT
        expect(vm.$router.push).to.have.been.calledWith({ query: { q: 'dublin', p: 2 } });
      });
    });
  });

  describe('created()', () => {
    it('should only set the page if theres a valid page number in the url', () => {
      // ARRANGE
      vm.$route = {
        query: {
          p: 1,
        },
      };

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(DojoPaginationStoreMock.commit).to.have.been.calledWith('setPage', 1);
    });

    it('should set up an event handler for pagination buttons', () => {
      // ARRANGE
      vm.$route = {
        query: {},
      };

      // ACT
      vm.$lifecycleMethods.created();

      // ASSERT
      expect(VuePaginationMock.PaginationEvent.$on).to.have.been.called;
    });
  });

  describe('watcher', () => {
    describe('dojos', () => {
      it('should handle the page numbers', () => {
        // ARRANGE
        vm.$route = {
          query: {
            p: 1,
          },
        };
        vm.$refs = {
          pagination: {
            totalPages: 2,
          },
        };
        sandbox.stub(vm, 'goToPage');

        // ACT
        vm.$watchers.dojos();

        // ASSERT
        expect(vm.goToPage).to.not.have.been.called;

        // ARRANGE
        vm.$route = {
          query: {
            p: 3,
          },
        };

        // ACT
        vm.$watchers.dojos();

        // ASSERT
        expect(vm.goToPage).to.have.been.calledWith(vm.$refs.pagination.totalPages);

        // ARRANGE
        vm.$route = {
          query: {
            p: 0,
          },
        };

        // ACT
        vm.$watchers.dojos();

        // ASSERT
        expect(vm.goToPage).to.have.been.calledWith(1);
      });
    });
    describe('paginatedDojos', () => {
      it('should set the button number based on the current page', () => {
        // ARRANGE
        vm.currentPage = 1;
        vm.$refs = {
          pagination: {
            setPage: () => {},
          },
        };
        sandbox.stub(vm.$refs.pagination, 'setPage');

        // ACT
        vm.$watchers.paginatedDojos();

        // ASSERT
        Vue.nextTick(() =>
          expect(vm.$refs.pagination.setPage).to.have.been.calledWith(vm.currentPage));
      });
    });

    describe('route', () => {
      it('should set the page if there is a page number in the url', () => {
        // ARRANGE
        vm.$route = {
          query: {
            p: 2,
          },
        };

        // ACT
        vm.$watchers.$route(vm.$route);

        // ASSERT
        expect(DojoPaginationStoreMock.commit).to.have.been.calledWith('setPage', vm.$route.query.p);
      });
    });
  });
});
