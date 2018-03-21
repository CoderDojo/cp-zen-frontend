<template>
  <div class="row cd-event-applications">
    <div class="cd-">
      <header class="cd-event-applications__header">
        <h3 class="cd-event-applications__header-title">
          {{ event.name }}
        </h3>
        <router-link :to="{ path: previousUrl }" replace class="cd-event-applications__header-old-interface">> Go back to previous interface</router-link>
      </header>
    </div>
    <div id="people">
      <v-client-table :data="tableData" :columns="tableColumns" :options="tableOptions" @sorted="removeGroupBy" @filter::sessionName="updateSelectableTickets">
        <template slot="afterBody" scope="props">
          <tr>
            <td>
              <p>aaaaaaaaaaaaaa</p>
              <i class="fa fa-file-o"> </i>
            </td>
          </tr>
        </template>
        <template slot="status" scope="props">
          <input type="checkbox" v-model="props.row.isApproved"/> <!--@change="toggleApproval"> </input> -->
        </template>
        <!--<div slot="filter__sessionName">
          <input type="checkbox" class="form-control" v-model="tableOptions.groupBy" @change="toggleGrouping()">
        </div> -->
      </v-client-table>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import { flatten, uniqBy } from 'lodash';
  import cdAttendee from './cd-attendee';
  import EventService from './service';
  import UserService from '@/users/service';
  import UserUtils from '@/users/util';
  import i18n from '@/i18n';

  export default {
    name: 'event-applications',
    props: [],
    data() {
      return {
        dojoId: null,
        eventId: null,
        event: {},
        filteredOnSession: null,
        tableOrdered: false,
        applications: [],
      };
    },
    computed: {
      tableOptions() {
        return {
          pagination: {
            dropdown: false,
          },
          sortIcon: {
            base: 'fa',
            up: 'fa-sort-asc',
            down: 'fa-sort-desc',
            is: 'fa-sort',
          },
          groupBy: this.groupBy,
          perPage: 999,
          perPageValues: [],
          headings: {
            name: 'Name',
            ticketName: 'Ticket',
            ticketType: 'Type',
            sessionName: 'Session',
            created: 'Applied at',
            age: 'Age',
            parent: 'Parent/Guardian',
            notes: 'Notes',
            status: 'Approved',
          },
          highlightMatches: true,
          filterByColumn: true,
          filterable: ['name', 'ticketName', 'ticketType', 'sessionName'],
          dateFormat: 'DD/MM HH:mm', // TODO i18n? moment?
          listColumns: this.listColumns, 
          descOrderColumn: 'applicationDate',
        }
      },
      tableData() {
        if(this.applications && this.applications.results) {
          return this.applications.results.map(a => {
            const { name, dateOfBirth, notes, ticketName, ticketType, created, status } = a;
            return Object.assign({
              sessionName: this.sessions[a.sessionId].name,
            }, {
              name,
              age: UserUtils.getAge(moment.utc(a.dateOfBirth).toDate()),
              notes,
              ticketName,
              ticketType,
              notes,
              created: moment.utc(created),
              status,
              isApproved: status === 'approved',
            });
          });
        }
        return [];
      },
      tickets() {
        if (this.event && this.event.sessions) {
          if (this.filteredOnSession) {
            return (this.event.sessions.find(s => s.name === this.filteredOnSession)).tickets;
          } else {
            return flatten(this.event.sessions.map(s => s.tickets));
          }
        }
        return [];
      },
      sessions() {
        const reducer = (sessions, el) => { sessions[el.id] = el; return sessions; } ;
        return this.event.sessions.reduce(reducer, {});
      },
      tableColumns() {
        let columns = ['name', 'parent', 'ticketName','ticketType', 'status', 'created', ]
        //let columns = ['name', 'parent', 'ticketName','ticketType', 'status', 'age', 'created', ]
        if (this.hasCustomNotes) columns.splice(columns.length - 1, 0, 'notes');
        if (this.event && this.event.sessions && this.event.sessions.length > 1) columns.splice(3, 0, 'sessionName');
        return columns;
      },
      listColumns() {
        if (this.event && this.event.sessions && this.tickets) {
          return {
            sessionName: this.event.sessions.map(s => ({ id: s.name, text: s.name })),
            ticketName: uniqBy(this.tickets.map(t => ({ id: t.name, text: t.name })), 'id'),
            ticketType: uniqBy(this.tickets.map(t => ({ id: t.type, text: t.type })), 'id'),
          }
        }
        return {};
      },
      hasCustomNotes() {
        const defaultNotes = i18n.t('N/A');
        if (this.applications && this.applications.results) {
          return !this.applications.results.every(a => a.notes === defaultNotes);
        } 
        return true;
      },
      groupBy() {
        if (this.event && this.event.sessions && this.event.sessions.length > 1
          && !this.tableOrdered ) {
          return 'sessionName';
        }
        return null;
      },
      previousUrl() {
        return `/dashboard/my-dojos/${this.dojoId}/events/${this.eventId}/applications`;
      },
    },
    methods: {
      /*toggleGrouping() {
        this.tableColumns.groupBy = this.tableColumns.groupBy ? false : 'sessionName';
      },*/
      getParents() {
        this.applications.forEach(a => {
          UserService.user.parents.get(a.userId)
            .then((res) => this.parents[a.userId] = res.body);
        });
      },
      removeGroupBy() {
        this.tableOrdered = true;
      },
      updateSelectableTickets(state) {
        this.filteredOnSession = state;
      },
    },
    components: {
      cdAttendee,
    },
    async created() {
      this.dojoId = this.$route.params.dojoId;
      this.eventId = this.$route.params.eventId;
      let data = await Promise.all([
        EventService.v3.load(
          this.dojoId,
          this.eventId,
          {
            params: {
              related: 'sessions.tickets',
            }
          }
        ),
        EventService.v3.applications.list(
          this.dojoId,
          this.eventId,
        ),
      ]);
      this.event = data[0].body;
      this.applications = data[1].body;
    },
  };
</script>
<style scoped lang="less">
  .cd-event-applications {
    padding: 0 32px;
    &__header{
      display: flex;
      justify-content: space-between;
      &-title {
        flex: 1;
      }
      &-old-interface {
        flex: 1;
        text-align: right;
      }
    }
  }
</style>
