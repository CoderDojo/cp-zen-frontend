import vueUnitHelper from 'vue-unit-helper';
import eventForm from '!!vue-loader?inject!@/events/cd-event-form';

describe('Event Form component', () => {
  let sandbox;
  let EventFormWithMocks;
  let MockDojosService;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    MockDojosService = {
      getDojoById: sandbox.stub(),
    };
    EventFormWithMocks = eventForm({
      '@/dojos/service': MockDojosService,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('should load user and event data', async () => {
        // ARRANGE
        MockDojosService.getDojoById.resolves({
          body: {
            city: { name: 'Here' },
            address1: 'There',
          },
        });
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.$route = {
          params: {
            dojoId: 'd1',
          },
        };
        // ACT
        await vm.$lifecycleMethods.created();

        // ASSERT
        expect(MockDojosService.getDojoById).to.have.been.calledOnce
          .and.calledWith('d1');
        expect(vm.address).to.equal('There');
        expect(vm.city).to.equal('Here');
      });
    });
  });

  describe('computed', () => {
    describe('tickets', () => {
      it('should reference dom elements', () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.$refs = {
          youthTickets: 'one',
          mentorTickets: 'two',
        };
        expect(vm.tickets).to.eql(['one', 'two']);
      });
    });
  });

  describe('methods', () => {
    describe('save', () => {
      it('should reference dom elements', async () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        const createTicket = sandbox.stub();
        const event = {
          preventDefault: sandbox.stub(),
        };

        vm.tickets = [
          { createTicket },
          { createTicket },
        ];
        await vm.save(event);
        expect(event.preventDefault).to.have.been.calledOnce;
        expect(createTicket).to.have.been.calledTwice;
      });
    });
  });
});
