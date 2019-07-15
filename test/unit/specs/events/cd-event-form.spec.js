import vueUnitHelper from 'vue-unit-helper';
import eventForm from '!!vue-loader?inject!@/events/cd-event-form';

describe('Event Form component', () => {
  let EventFormWithMocks;
  let MockDojosService;
  let MockEventsService;
  let MockEventStore;
  let clock;
  let descriptionHtml;

  beforeEach(() => {
    // Tues Jun 04 2019 10AM
    clock = sinon.useFakeTimers({
      now: 1559638800000,
    });

    descriptionHtml = '<p>Suggested Notes:<br /><br />Please:</p><ul><li>A thingy and stuff</li></ul>';

    MockDojosService = {
      getDojoById: sinon.stub(),
    };

    MockEventsService = {
      v3: {
        get: sinon.stub(),
        load: sinon.stub(),
        create: sinon.stub(),
        update: sinon.stub(),
      },
    };

    MockEventStore = {
      commit: sinon.stub(),
      getters: {
        address: sinon.stub().resolves('123 Fake Street'),
      },
    };

    EventFormWithMocks = eventForm({
      '@/dojos/service': MockDojosService,
      '@/events/service': MockEventsService,
      '@/events/event-store': MockEventStore,
    });
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('lifecycle functions', () => {
    describe('created', () => {
      context('when creating an event', () => {
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
          sinon.stub(vm, 'initializeStore');

          // ACT
          await vm.$lifecycleMethods.created();

          // ASSERT
          expect(MockDojosService.getDojoById).to.have.been.calledOnce
            .and.calledWith('d1');
          expect(vm.initializeStore).to.have.been.calledOnce;
          expect(vm.latestEvent).to.eql({ address: 'Address' });
          expect(vm.editing).to.eql(false);
        });
      });
      context('when editing an event', () => {
        context('when event was created with new form', () => {
          it('should load dojo and event data', async () => {
            MockDojosService.getDojoById.resolves({
              body: {
                city: { name: 'Here' },
                address1: 'There',
              },
            });
            MockEventsService.v3.load.resolves({
              body: {
                address: 'Address',
                newForm: true,
              },
            });
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.$route = {
              params: {
                dojoId: 'd1',
                eventId: 'e1',
              },
            };

            await vm.$lifecycleMethods.created();

            expect(MockDojosService.getDojoById).to.have.been.calledOnce
              .and.calledWith('d1');
            expect(MockEventsService.v3.load).to.have.been.calledOnce
              .and.calledWith('e1');
            expect(vm.editing).to.eql(true);
          });

          it('should set event information in event store', async () => {
            MockDojosService.getDojoById.resolves({
              body: {
                city: { name: 'Here' },
                address1: 'There',
              },
            });
            MockEventsService.v3.load.resolves({
              body: {
                address: 'Address',
                newForm: true,
              },
            });
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.$route = {
              params: {
                dojoId: 'd1',
                eventId: 'e1',
              },
            };

            await vm.$lifecycleMethods.created();

            expect(MockEventStore.commit).to.have.been.calledOnce
              .and.calledWith('setEvent', { address: 'Address', newForm: true });
          });
        });

        context('when event was created with old form', () => {
          it('should load dojo and event data', async () => {
            // ARRANGE
            MockDojosService.getDojoById.resolves({
              body: {
                city: { name: 'Here' },
                address1: 'There',
              },
            });
            MockEventsService.v3.load.resolves({
              body: {
                address: 'Address',
                newForm: false,
              },
            });
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.$route = {
              params: {
                dojoId: 'd1',
                eventId: 'e1',
              },
            };
            sinon.stub(vm, 'initializeStore');
            vm.$router = {
              push: sinon.stub(),
            };

            await vm.$lifecycleMethods.created();

            expect(MockDojosService.getDojoById).to.have.been.calledOnce
              .and.calledWith('d1');
            expect(MockEventsService.v3.load).to.have.been.calledOnce
              .and.calledWith('e1');
            expect(vm.initializeStore).not.to.have.been.called;
            expect(vm.$router.push).to.have.been.calledOnce
              .and.calledWith('/dashboard/dojo/d1/event-form/e1');
          });
        });
      });
    });
  });

  describe('computed', () => {
    describe('truncatedDescription', () => {
      context('when description is not null', () => {
        it('formats the address correctly', () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          MockEventStore.getters = {
            description: descriptionHtml,
          };
          expect(vm.truncatedDescription).to.eql('Suggested Notes: Please: A thingy and... ');
        });
      });
    });
    describe('formattedAddress', () => {
      it('formats the address correctly', () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        MockEventStore.getters = {
          address: '<p>123 Fake Street</p>',
          city: 'London',
        };
        expect(vm.formattedAddress).to.eql('123 Fake Street... London');
      });
      it('truncates address to 5 words', () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        MockEventStore.getters = {
          address: '<p>123 Really Really Long Named Fake Street</p>',
          city: 'London',
        };
        expect(vm.formattedAddress).to.eql('123 Really Really Long Named... London');
      });
    });
  });

  describe('methods', () => {
    describe('initializeStore', () => {
      it('sets country and dojoId in store', async () => {
        const vm = vueUnitHelper(EventFormWithMocks);
        vm.loggedInUser = {};
        vm.dojo = {
          id: 'd1',
          address1: 'Address 1 from Dojo',
          city: { name: 'Dojo City name' },
          country: { alpha2: 'GB' },
        };

        await vm.initializeStore();
        expect(MockEventStore.commit).to.have.callCount(6);
        expect(MockEventStore.commit).to.have.been
          .calledWith('setDojoId', 'd1');
        expect(MockEventStore.commit).to.have.been
          .calledWith('setCountry', { alpha2: 'GB' });
      });

      context('when no latestEvent', () => {
        it('sets event values in store from dojo', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.loggedInUser = { id: 'U1' };
          vm.dojo = {
            id: 'd1',
            notes: 'The dojo description notes',
            address1: 'Address 1 from Dojo',
            city: { name: 'Dojo City name' },
            country: { alpha2: 'GB' },
          };

          await vm.initializeStore();
          expect(MockEventStore.commit).to.have.callCount(6);
          expect(MockEventStore.commit).to.have.been
            .calledWith('setDescription', 'The dojo description notes');
          expect(MockEventStore.commit).to.have.been
            .calledWith('setAddress', 'Address 1 from Dojo');
          expect(MockEventStore.commit).to.have.been
            .calledWith('setCity', 'Dojo City name');
        });
      });
      context('when latestEvent is present', () => {
        it('should set event store values from the latestEvent', async () => {
          const vm = vueUnitHelper(EventFormWithMocks);
          vm.loggedInUser = { id: 'U1' };
          const startTime = '2222-06-19 13:00';
          const endTime = '2222-06-19 16:00';

          const event = {
            description: 'The event description',
            address: 'Address from event',
            city: { nameWithHierarchy: 'City' },
            startTime,
            endTime,
          };
          vm.latestEvent = event;

          await vm.initializeStore();
          expect(MockEventStore.commit).to.have.callCount(8);
          expect(MockEventStore.commit).to.have.been
            .calledWith('setCityFromObject', { nameWithHierarchy: 'City' });
          expect(MockEventStore.commit).to.have.been
            .calledWith('setAddress', 'Address from event');
          expect(MockEventStore.commit).to.have.been
            .calledWith('setDescription', 'The event description');
          expect(MockEventStore.commit).to.have.been
            .calledWith('generateNextEventDates', { lastStartTime: startTime, lastEndTime: endTime });
          expect(MockEventStore.commit).to.have.been
            .calledWith('setTicketQuantitiesFromEvent', event);
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
      context('when creating new event', () => {
        context('when succesful', () => {
          it('calls events service with event from store', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.$router = {
              push: sinon.stub(),
            };
            const event = {
              preventDefault: sinon.stub(),
            };
            vm.validateForm = sinon.stub().resolves(true);

            const expected = {
              address: '123 Fake Street',
            };

            MockEventStore.getters = {
              event: expected,
            };

            await vm.save(event);

            sinon.assert.calledWith(MockEventsService.v3.create, sinon.match(expected));
          });

          it('redirects to Dojo Details page', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.validateForm = sinon.stub().resolves(true);
            vm.dojo = {
              id: 'dojo-id-uuid',
            };

            const event = {
              preventDefault: sinon.stub(),
            };

            vm.$router = {
              push: sinon.stub(),
            };

            await vm.save(event);

            expect(vm.$router.push).to.be
              .calledWith({ name: 'DojoDetailsId', params: { id: 'dojo-id-uuid' } });
          });
        });

        context('when unsuccessful', () => {
          it('sets submit error to be true', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.validateForm = sinon.stub().resolves(true);
            vm.dojo = {
              id: 'dojo-id-uuid',
            };

            vm.$router = {
              push: sinon.stub(),
            };

            const event = {
              preventDefault: sinon.stub(),
            };

            MockEventsService.v3.create.throws();
            await vm.save(event);

            expect(vm.submitError).to.eql(true);
          });
        });
      });

      context('when editing event', () => {
        context('when succesful', () => {
          it('calls events service with event from store', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.editing = true;
            vm.$router = {
              push: sinon.stub(),
            };
            const event = {
              preventDefault: sinon.stub(),
            };
            vm.validateForm = sinon.stub().resolves(true);

            const expected = {
              address: '123 Fake Street',
            };

            MockEventStore.getters = {
              event: expected,
            };

            await vm.save(event);

            sinon.assert.calledWith(MockEventsService.v3.update, sinon.match(expected));
          });

          it('redirects to Dojo Details page', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.editing = true;
            vm.validateForm = sinon.stub().resolves(true);
            vm.dojo = {
              id: 'dojo-id-uuid',
            };

            const event = {
              preventDefault: sinon.stub(),
            };

            vm.$router = {
              push: sinon.stub(),
            };

            await vm.save(event);

            expect(vm.$router.push).to.be
              .calledWith({ name: 'DojoDetailsId', params: { id: 'dojo-id-uuid' } });
          });
        });

        context('when unsuccessful', () => {
          it('sets submit error to be true', async () => {
            const vm = vueUnitHelper(EventFormWithMocks);
            vm.editing = true;
            vm.validateForm = sinon.stub().resolves(true);
            vm.dojo = {
              id: 'dojo-id-uuid',
            };

            vm.$router = {
              push: sinon.stub(),
            };

            const event = {
              preventDefault: sinon.stub(),
            };

            MockEventsService.v3.update.throws();
            await vm.save(event);

            expect(vm.submitError).to.eql(true);
          });
        });
      });
    });
  });
});
