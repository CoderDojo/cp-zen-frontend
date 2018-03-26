<template>
  <div class="row cd-event-applications">
    <div class="cd-">
      <header class="cd-event-applications__header">
        <router-link :to="{ path: previousUrl }" replace class="cd-event-applications__header-old-interface">> Go back to previous interface</router-link>
        <div class="cd-event-applications__header-row">
          <h3 class="cd-event-applications__header-title">
            {{ event.name }}
          </h3>
          <button class="btn btn-secondary"> <i class="fa fa-file-text-o"></i></button>
        </div>
      </header>
    </div>
    <div id="people">
      <v-client-table :data="tableData" :columns="tableColumns" :options="tableOptions" @sorted="removeGroupBy" @filter::sessionName="updateSelectableTickets">
        <template slot="afterBody" scope="props">
          <!-- TODO : export -->
        </template>
        <template slot="__group_meta" scope="{value, data}">
          <span class="cd-event-applications__grouping-header">({{ data.booked }}/{{ data.qty }})</span>
        </template>
        <template slot="status" scope="props">
          <input type="checkbox" v-model="props.row.isApproved"/> <!--@change="toggleApproval"> </input> -->
        </template>
        <template slot="name" scope="props">
          <img src="https://placebear.com/30/30"/>
          <router-link :to="{ path: profileUrl(props.row.id) }">{{ props.row.name }}</router-link>
        </template>
        <template slot="notes" scope="props">
          <i class="fa fa-commenting-o" :title="props.row.notes" v-if="isCustomNote(props.row.notes)"></i>
        </template>
        <template slot="appendBody" scope="props">
          <tr>
            <td colspan="3">
              <div> {{ $t('Ninjas') }}: {{ nbNinja }} </div>
            </td>
            <td colspan="5">
              <div> {{ $t('Mentors') }}: {{ nbMentor }} </div>
            </td>
          </tr>
        </template>
        <template slot="actions" scope="props">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" :id="`actions-${props.row.id}`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fa fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu" :aria-labelledby="`actions-${props.row.id}`">
              <li><a href="#">Delete</a></li>
              <!-- TODO : mailTo -->
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
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
          sortable: [ 'name', 'parent', 'ticketName', 'ticketType', 'sessionName', 'status', 'created'],
          groupBy: this.groupBy,
          groupMeta: this.groupMeta,
          perPage: 999,
          perPageValues: [],
          headings: {
            name: 'Name',
            ticketName: 'Ticket',
            ticketType: 'Type',
            sessionName: 'Session',
            created: 'Applied at',
            age: 'Age',
            parent: 'Parent',
            notes: 'Notes',
            status: 'Approved',
            actions: '...',
          },
          highlightMatches: true,
          filterByColumn: true,
          filterable: ['name', 'parent', 'ticketName', 'ticketType', 'sessionName'],
          dateFormat: 'DD/MM HH:mm', // TODO i18n? moment?
          listColumns: this.listColumns, 
          columnsClasses: {
            'notes': 'cd-event-applications__notes-cell',
          },
          descOrderColumn: 'applicationDate',
        }
      },
      tableData() {
        if(this.applications && this.applications.results) {
          return this.applications.results.map(a => {
            const { id, name, dateOfBirth, notes, ticketName, ticketType, created, status } = a;
            return Object.assign({
              sessionName: this.sessions[a.sessionId].name,
            }, {
              id,
              name,
              age: UserUtils.getAge(moment.utc(a.dateOfBirth).toDate()),
              notes,
              ticketName,
              ticketType,
              notes,
              created: moment.utc(created),
              status,
              notesVisible: false,
              isApproved: status === 'approved',
            });
          });
        }
        return [];
      },
      groupMeta() {
        return this.event && this.event.sessions ? this.event.sessions.map((s) => ({
          value: s.name,
          data: {
            qty: s.tickets.reduce((qty, t) => qty + t.quantity, 0),
            booked: (this.applications.results.filter((a) => a.sessionId === s.id)).length, 
          },
        })) : [];
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
        // TODO : do we need age, really ?
        //let columns = ['name', 'parent', 'ticketName','ticketType', 'status', 'age', 'created', ]
        if (this.hasCustomNotes) columns.splice(columns.length - 1, 0, 'notes');
        if (this.event && this.event.sessions && this.event.sessions.length > 1) columns.splice(3, 0, 'sessionName');
        columns.push('actions');
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
          return !this.applications.results.every((a) => !this.isCustomNote(a.notes));
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
      nbNinja() {
        if (this.applications && this.applications.results) {
          return (this.applications.results.filter(a => a.ticketType === 'ninja' && a.deleted === false && a.status === 'approved')).length;
        }
        return 0;
      },
      nbMentor() {
        if (this.applications && this.applications.results) {
          return (this.applications.results.filter(a => a.ticketType === 'mentor' && a.deleted === false && a.status === 'approved')).length;
        }
        return 0;
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
      isCustomNote(note) {
        const defaultNote = i18n.t('N/A');
        const strippedNote = note.replace(/\s/g, ''); 
        return !(strippedNote === '' || note === defaultNote);
      },
      profileUrl(id) {
        return `/dashboard/profile/${id}`;
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
      flex-direction: column;
      &-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
      }
      &-title {
        flex: 1;
      }
      &-old-interface {
        display: block;
        width: 100%;
        flex: 1;
        text-align: right;
      }
    }
    &__grouping-header {
      float: right;
    }
    &__notes {
      &-cell {
        text-align: center;
      }
    }
    &__status {
      &-cell {
        text-align: center;
      }
    }
  }
  tr {
    font-weight: bold;
    text-align: center;
  }
</style>
