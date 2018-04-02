import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import UserUtils from '@/users/util';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    applicationTable: {
      state: {
        event: {},
        applications: [],
        data: [],
        sessions: {},
        parents: {},
      },
      /* eslint-disable no-param-reassign */
      mutations: {
        applications(state, data) {
          state.applications = data;
          this.commit('tableData');
        },
        tableData(state) {
          state.data = state.applications.map((a) => {
            const { id, name, dateOfBirth, userId, notes, ticketName, ticketType, created, status } = a;
             return Object.assign({
                sessionName: state.sessions[a.sessionId].name,
              }, {
                id,
                userId,
                name,
                parent: state.parents[userId],
                age: UserUtils.getAge(moment.utc(dateOfBirth).toDate()),
                ticketName,
                ticketType,
                notes,
                created: moment.utc(created),
                status,
                notesVisible: false,
                isApproved: status === 'approved',
             });
          });
        },
        event(state, data) {
          state.event = data;
          // eslint-disable-next-line no-param-reassign
          const reducer = (sessions, el) => { sessions[el.id] = el; return sessions; };
          state.sessions = state.event.sessions.reduce(reducer, {});
        },
        parentsOf(state, { userId, data }) {
          state.parents[userId] = data; 
          const row = state.data.findIndex((row) => row.userId === userId);
          state.data[row].parent = data;
        },
        toggleApproval(state, id, value) {
          state.data[id] = value;
        },
      },
      getters: {
        applications: state => state.applications,
        event: state => state.event,
        sessions: (state) => state.sessions,
        data: (state) => state.data,
      },
    },
  },
  /* eslint-enable no-param-reassign */
});
