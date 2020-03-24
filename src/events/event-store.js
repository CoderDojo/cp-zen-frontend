import Vuex from 'vuex';
import moment from 'moment';

const store = new Vuex.Store({
  strict: true,
  state: {
    eventDate: moment().format('YYYY-MM-DD'),
    startTime: moment
      .utc()
      .add(2, 'hours')
      .minute(0)
      .format('HH:mm'),
    endTime: moment
      .utc()
      .add(3, 'hours')
      .minute(0)
      .format('HH:mm'),
    event: {
      name: '',
      description: '',
      address: '',
      createdBy: '',
      city: {},
      country: {},
      dojoId: '',
      type: 'one-off',
      status: 'published',
      recurringType: 'weekly',
      public: true,
      useDojoAddress: false,
      ticketApproval: false,
      notifyOnApplicant: false,
      sendEmails: true,
      newForm: true,
      dates: [
        {
          startTime: moment
            .utc()
            .add(2, 'hours')
            .minute(0),
          endTime: moment
            .utc()
            .add(3, 'hours')
            .minute(0),
        },
      ],
      sessions: [
        {
          name: 'Dojo',
          description: 'Dojo Session',
          tickets: [
            { name: 'Youth', type: 'ninja', quantity: 20 },
            { name: 'Mentor', type: 'mentor', quantity: 5 },
          ],
        },
      ],
    },
  },

  /* eslint-disable no-param-reassign */
  mutations: {
    setEvent(state, event) {
      state.eventDate = moment.utc(event.startTime).format('YYYY-MM-DD');
      state.startTime = moment.utc(event.startTime).format('HH:mm');
      state.endTime = moment.utc(event.endTime).format('HH:mm');

      // Don't want these props to be sent when submitting form.
      delete event.createdAt;
      delete event.createdBy;
      delete event.eventbriteId;
      delete event.eventbriteUrl;
      delete event.position;
      delete event.startTime;
      delete event.endTime;

      if (event.city == null) {
        event.city = {};
      }

      // This is a workaround for '$$hashKey': 'value' in the json objects of some events.
      // This is something from angular tracking its props being persisted somehow.
      if (event.city.nameWithHierarchy) {
        event.city = { nameWithHierarchy: event.city.nameWithHierarchy };
      }

      if (event.sessions) {
        event.sessions[0].tickets.forEach(t => delete t.approvedApplications);
      }

      // default is to not send emails when editing
      state.event = { ...event, sendEmails: false };
    },

    setEventName(state, name) {
      state.event.name = name;
    },

    setCityFromEventObject(state, cityObject) {
      if (cityObject) {
        state.event.city = {
          nameWithHierarchy: cityObject.nameWithHierarchy || cityObject.toponymName,
        };
      }
    },

    setAddress(state, address) {
      state.event.address = address;
    },

    setDescription(state, description) {
      state.event.description = description;
    },

    setCity(state, dojo) {
      if (dojo.city === null || dojo.city.nameWithHierarchy === undefined) {
        state.event.city = {};
        return;
      }
      state.event.city = { nameWithHierarchy: dojo.city.nameWithHierarchy };
    },

    setCountry(state, value) {
      state.event.country = value;
    },

    setDojoId(state, value) {
      state.event.dojoId = value;
    },

    generateNextEventDates(state, { lastStartTime, lastEndTime }) {
      const startDate = moment.utc(lastStartTime);
      let newDate = startDate.add(7, 'days');
      const inPast = moment().diff(newDate, 'days') > 0;
      if (inPast) {
        const neededDay = startDate.day();
        newDate =
          moment().isoWeekday() <= neededDay
            ? moment().isoWeekday(neededDay)
            : moment()
                .add(1, 'weeks')
                .isoWeekday(neededDay);
      }

      state.eventDate = newDate.format('YYYY-MM-DD');
      state.startTime = startDate.format('HH:mm');

      const startTime = moment.utc(newDate);
      const startTimeElements = state.startTime.split(':');
      startTime.hours(startTimeElements[0]);
      startTime.minutes(startTimeElements[1]);
      state.event.dates[0].startTime = startTime;

      state.endTime = moment.utc(lastEndTime).format('HH:mm');
      const endTime = moment.utc(newDate);
      const endTimeElements = state.endTime.split(':');
      endTime.hours(endTimeElements[0]);
      endTime.minutes(endTimeElements[1]);
      state.event.dates[0].endTime = endTime;
    },

    setTicketQuantitiesFromEvent(state, event) {
      if (event.sessions && event.sessions.length > 0) {
        // If there are any sessions for the event just take the first one.
        // Any event that has more than one session was created using the old form
        // and it is unlikely to map to the new form structure
        const previousTickets = event.sessions[0].tickets;
        const prevYouthTickets = previousTickets.find(
          ticket => ticket.name === 'Youth',
        );
        const prevMentorTickets = previousTickets.find(
          ticket => ticket.name === 'Mentor',
        );

        if (prevYouthTickets !== undefined) {
          const youthTickets = state.event.sessions[0].tickets.find(
            ticket => ticket.type === 'ninja',
          );
          youthTickets.quantity = prevYouthTickets.quantity;
        }
        if (prevMentorTickets !== undefined) {
          const mentorTickets = state.event.sessions[0].tickets.find(
            ticket => ticket.type === 'mentor',
          );
          mentorTickets.quantity = prevMentorTickets.quantity;
        }
      }
    },

    updateEventDate(state, value) {
      state.eventDate = value;
      state.event.dates[0].startTime = moment.utc(
        `${state.eventDate} ${state.startTime}`,
      );
      state.event.dates[0].endTime = moment.utc(
        `${state.eventDate} ${state.endTime}`,
      );
    },

    updateStartTime(state, value) {
      state.startTime = value;
      state.event.dates[0].startTime = moment.utc(
        `${state.eventDate} ${state.startTime}`,
      );
    },

    updateEndTime(state, value) {
      state.endTime = value;
      state.event.dates[0].endTime = moment.utc(
        `${state.eventDate} ${state.endTime}`,
      );
    },

    updateTicketQuantity(state, { type, quantity }) {
      const tickets = state.event.sessions[0].tickets.find(
        ticket => ticket.type === type,
      );
      tickets.quantity = quantity;
    },

    setSendEmails(state, value) {
      state.event.sendEmails = value;
    },

    setCreatedBy(state, value) {
      state.event.createdBy = value;
    },
  },
  getters: {
    event: state => state.event,
    eventName: state => state.event.name,
    address: state => state.event.address,
    city: state => state.event.city.nameWithHierarchy,
    description: state => state.event.description,
    eventDate: state => state.eventDate,
    startTime: state => state.startTime,
    endTime: state => state.endTime,
    sendEmails: state => state.event.sendEmails,
    // eslint-disable-next-line no-unused-vars
    ticketQuantity: state => (type) => {
      const tickets = state.event.sessions[0].tickets.find(
        ticket => ticket.type === type,
      );
      return tickets.quantity;
    },
  },
  /* eslint-enable no-param-reassign */
});

export default store;
