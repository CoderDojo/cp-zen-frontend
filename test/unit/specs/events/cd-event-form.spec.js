import vueUnitHelper from 'vue-unit-helper';
import eventForm from '!!vue-loader?inject!@/events/cd-event-form';
import moment from 'moment';

describe('Event Form component', () => {
  let EventFormWithMocks;
  let MockDojosService;
  let MockEventsService;
  let clock;

  beforeEach(() => {
    // Tues Jun 04 2019 10AM
    clock = sinon.useFakeTimers({
      now: 1559638800000,
    });

    MockDojosService = {
      getDojoById: sinon.stub(),
    };
    MockEventsService = {
      v3: {
        get: sinon.stub(),
        create: sinon.stub(),
      },
    };
    EventFormWithMocks = eventForm({
      '@/dojos/service': MockDojosService,
      '@/events/service': MockEventsService,
    });
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      it('should load dojo and last event data', async () => {
        // ARRANGE
        MockDojosService.getDojoById.resolves({
          body: {
            city: { name: 'Here' },
            address1: 'There',
          },
        });
        MockEventsService.v3.get.resolves({
          body: {
            results: [{
              address: 'Address',
            }],
          },
        });
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.$route = {
          params: {
            dojoId: 'd1',
          },
        };
        sinon.stub(vm, 'populateForm');

        // ACT
        await vm.$lifecycleMethods.created();

        // ASSERT
        expect(MockDojosService.getDojoById).to.have.been.calledOnce
          .and.calledWith('d1');
        expect(vm.populateForm).to.have.been.calledOnce;
        expect(vm.latestEvent).to.eql({ address: 'Address' });
        // expect(vm.city).to.equal('Here');
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
    describe('populateForm', () => {
      describe('when no latestEvent', () => {
        it('should set values from dojo', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.dojo = {
            notes: 'The dojo description notes',
            address1: 'Address 1 from Dojo',
            city: { name: 'Dojo City name' },
          };

          await vm.populateForm();
          expect(vm.description).to.eql('The dojo description notes');
          expect(vm.address).to.eql('Address 1 from Dojo');
          expect(vm.city).to.eql({ nameWithHierarchy: 'Dojo City name' });
        });
      });
      describe('when latestEvent is present', () => {
        it('should set values from the latestEvent', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            description: 'The event description',
            address: 'Address from event',
          };
          sinon.stub(vm, 'populateCityFromLatestEvent');
          sinon.stub(vm, 'populateDatesAndTimesFromLatestEvent');
          sinon.stub(vm, 'populateTicketQuantitiesFromLatestEvent');
          await vm.populateForm();
          expect(vm.description).to.eql('The event description');
          expect(vm.address).to.eql('Address from event');
          expect(vm.populateCityFromLatestEvent).to.have.been.calledOnce;
          expect(vm.populateDatesAndTimesFromLatestEvent).to.have.been.calledOnce;
          expect(vm.populateTicketQuantitiesFromLatestEvent).to.have.been.calledOnce;
        });
      });
    });
    describe('populateCityFromLatestEvent', () => {
      describe('when event city has toponymName', () => {
        it('sets city correctly', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            city: {
              toponymName: 'City name',
            },
          };
          await vm.populateCityFromLatestEvent();
          expect(vm.city).to.eql({ nameWithHierarchy: 'City name' });
        });
      });
      describe('when event city has nameWithHierarchy', () => {
        it('sets city correctly', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            city: {
              nameWithHierarchy: 'City name',
            },
          };
          await vm.populateCityFromLatestEvent();
          expect(vm.city).to.eql({ nameWithHierarchy: 'City name' });
        });
      });
    });
    describe('populateDatesAndTimesFromLatestEvent', () => {
      it('sets the start time to match the previous event', async () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.latestEvent = {
          startTime: '2019-06-14T11:00:00.000Z',
        };
        await vm.populateDatesAndTimesFromLatestEvent();
        expect(vm.startingTime).to.equal('11:00');
      });
      it('sets the finish time to match the previous event', async () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.latestEvent = {
          endTime: '2019-06-14T14:00:00.000Z',
        };
        await vm.populateDatesAndTimesFromLatestEvent();
        expect(vm.finishTime).to.equal('14:00');
      });
      describe('when latest event is in the future', () => {
        it('sets eventDate 1 week after latest event', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            startTime: '2019-06-14T11:00:00.000Z',
          };
          await vm.populateDatesAndTimesFromLatestEvent();
          expect(vm.eventDate).to.equal('2019-06-21');
        });
      });
      describe('when latest event was less than a week ago', () => {
        it('sets eventDate to next occurence of same day', async () => {
          // last event was on a Saturday
          // we are creating new event on Tuesday
          // eventDate should be the next Saturday
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            startTime: '2019-06-01T11:00:00.000Z',
          };
          await vm.populateDatesAndTimesFromLatestEvent();
          expect(vm.eventDate).to.equal('2019-06-08');
        });
      });
      describe('when latest event was more than a week ago', () => {
        it('sets eventDate to next occurence of same day', async () => {
          // last event was on a Sunday a month ago
          // eventDate should be the next Sunday
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.latestEvent = {
            startTime: '2019-05-19T11:00:00.000Z',
          };
          await vm.populateDatesAndTimesFromLatestEvent();
          expect(vm.eventDate).to.equal('2019-06-09');
        });
      });
    });

    describe('populateTicketQuantitiesFromLatestEvent', () => {
      describe('when previous event contains matching session', () => {
        it('sets quantities for mentor and youth tickets', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.$refs = {
            youthTickets: {
              setQuantity: sinon.stub(),
            },
            mentorTickets: {
              setQuantity: sinon.stub(),
            },
          };
          vm.latestEvent = {
            sessions: [{
              tickets: [
                { name: 'Youth', quantity: 77 },
                { name: 'Mentor', quantity: 45 },
              ],
            }],
          };
          await vm.populateTicketQuantitiesFromLatestEvent();
          expect(vm.$refs.youthTickets.setQuantity).to.have.been.calledOnce
            .and.calledWith(77);
          expect(vm.$refs.mentorTickets.setQuantity).to.have.been.calledOnce
            .and.calledWith(45);
        });
      });

      describe('when previous event does not contain matching session', () => {
        it('does not set quantities for mentor and youth tickets', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.$refs = {
            youthTickets: {
              setQuantity: sinon.stub(),
            },
            mentorTickets: {
              setQuantity: sinon.stub(),
            },
          };
          vm.latestEvent = {
            sessions: [{
              tickets: [
                { name: 'HTML', quantity: 77 },
                { name: 'Scratch', quantity: 45 },
              ],
            }],
          };
          await vm.populateTicketQuantitiesFromLatestEvent();
          expect(vm.$refs.youthTickets.setQuantity).to.have.callCount(0);
          expect(vm.$refs.mentorTickets.setQuantity).to.have.callCount(0);
        });
      });

      describe('when previous event has no session', () => {
        it('does not set quantities for mentor and youth tickets', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.$refs = {
            youthTickets: {
              setQuantity: sinon.stub(),
            },
            mentorTickets: {
              setQuantity: sinon.stub(),
            },
          };
          vm.latestEvent = {
            sessions: [],
          };
          await vm.populateTicketQuantitiesFromLatestEvent();
          expect(vm.$refs.youthTickets.setQuantity).to.have.callCount(0);
          expect(vm.$refs.mentorTickets.setQuantity).to.have.callCount(0);
        });
      });
    });

    describe('validateForm()', () => {
      it('should return true when form is valid', async () => {
        // ARRANGE
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.$validator = {
          validateAll: () => true,
        };

        // ACT
        const isValid = await vm.validateForm();

        // ASSERT
        expect(isValid).to.equal(true);
      });

      it('should return false when form is invalid', async () => {
        // ARRANGE
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.$validator = {
          validateAll: () => false,
        };

        // ACT
        const isValid = await vm.validateForm();

        // ASSERT
        expect(isValid).to.equal(false);
      });
    });

    describe('save', () => {
      describe('when succesful', () => {
        it('should get ticket information from child components', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.$router = {
            push: sinon.stub(),
          };
          vm.validateForm = sinon.stub().resolves(true);

          const createTicket = sinon.stub();
          const event = {
            preventDefault: sinon.stub(),
          };

          vm.tickets = [
            { createTicket },
            { createTicket },
          ];
          await vm.save(event);
          expect(event.preventDefault).to.have.been.calledOnce;
          expect(createTicket).to.have.been.calledTwice;
        });

        it('should call events service correctly', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.$router = {
            push: sinon.stub(),
          };
          const event = {
            preventDefault: sinon.stub(),
          };
          vm.validateForm = sinon.stub().resolves(true);
          vm.$refs = {
            youthTickets: {
              createTicket: sinon.stub().returns({ name: 'Youth', quantity: 11 }),
            },
            mentorTickets: {
              createTicket: sinon.stub().returns({ name: 'Mentor', quantity: 6 }),
            },
          };

          vm.address = '123 Fake Street';
          vm.city = { nameWithHierarchy: 'Fake Town' };
          vm.dojo = {
            id: '46dae76e-4118-42fb-89cd-27a6080a8f3b',
            country: {
              countryName: 'Ireland',
              countryNumber: 372,
              continent: 'EU',
              alpha2: 'IE',
              alpha3: 'IRL',
            },
          };
          vm.startTime = moment();
          vm.endTime = moment();
          vm.description = 'Event description';
          vm.name = 'Event name';

          await vm.save(event);

          const expected = {
            address: '123 Fake Street',
            city: { nameWithHierarchy: 'Fake Town' },
            country: {
              countryName: 'Ireland',
              countryNumber: 372,
              continent: 'EU',
              alpha2: 'IE',
              alpha3: 'IRL',
            },
            dates: [{
              endTime: moment(),
              startTime: moment(),
            }],
            description: 'Event description',
            dojoId: '46dae76e-4118-42fb-89cd-27a6080a8f3b',
            name: 'Event name',
            notifyOnApplicant: false,
            public: true,
            sessions: [{
              description: 'Dojo Session',
              name: 'Dojo',
              tickets: [
                { name: 'Youth', quantity: 11 },
                { name: 'Mentor', quantity: 6 },
              ],
            }],
            status: 'published',
            ticketApproval: false,
            type: 'one-off',
            useDojoAddress: false,
          };
          sinon.assert.calledWith(MockEventsService.v3.create, sinon.match(expected));
        });

        it('should redirect to Dojo Details page', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.validateForm = sinon.stub().resolves(true);
          vm.dojo = {
            id: 'dojo-id-uuid',
          };

          const createTicket = sinon.stub();
          const event = {
            preventDefault: sinon.stub(),
          };

          vm.$router = {
            push: sinon.stub(),
          };

          vm.tickets = [
            { createTicket },
            { createTicket },
          ];
          await vm.save(event);

          expect(vm.$router.push).to.be
            .calledWith({ name: 'DojoDetailsId', params: { id: 'dojo-id-uuid' } });
        });
      });
    });
  });
});
