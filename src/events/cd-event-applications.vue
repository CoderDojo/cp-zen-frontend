<template>
  <div class="row cd-event-applications">
    <div class="cd-">
      <header class="cd-event-applications__header">
        <router-link :to="{ path: previousUrl }" replace class="cd-event-applications__header-old-interface">> Go back to previous interface</router-link>
        <div class="cd-event-applications__header-row">
          <h3 class="cd-event-applications__header-title">
            {{ event.name }}
          </h3>
          <div class="cd-event-applications__header-title-actions">
            <i class="fa fa-2x fa-file-text-o"></i>
            <i class="fa fa-2x fa-envelope-o"></i>
          </div>
        </div>
      </header>
    </div>
    <div id="people">
      <v-client-table ref="applicationTable" :data="tableData" :columns="tableColumns" :options="tableOptions" @sorted="removeGroupBy" @filter::sessionName="updateSelectableTickets" class="cd-event-applications__table">
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
          <div class="cd-event-applications__avatar" :style="`background-image: url('/api/2.0/profiles/${props.row.userId}/avatar_img');`"></div>
          <router-link :to="{ path: profileUrl(props.row.userId) }">{{ props.row.name }}</router-link>
        </template>
        <template slot="notes" scope="props">
          <i class="fa fa-commenting-o" :title="props.row.notes" v-if="isCustomNote(props.row.notes)"></i>
        </template>
        <tr slot="appendBody" scope="props">
          <td colspan="3">
            <div> {{ $t('Ninjas') }}: {{ nbNinja }} </div>
          </td>
          <td colspan="5">
            <div> {{ $t('Mentors') }}: {{ nbMentor }} </div>
          </td>
        </tr>
        <template slot="actions" scope="props">
          <dropdown icon="ellipsis-v" align="right" :caret="false">
            <li @click="delete(props.row.id)"><a><i class="fa fa-times"></i>Delete</a></li>
            <!-- TODO : mailTo -->
            <li @click="contact(props.row.userId)"><a><i class="fa fa-envelope-o"></i>Contact</a></li>
          </dropdown>
          <!--<div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" :id="`actions-${props.row.id}`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fa fa-ellipsis-v"></i>
            </button>
          </div>--> 
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
  import i18n from '@/i18n';
  import Dropdown from '@/common/cd-dropdown';
  import UserService from '@/users/service';
  import UserUtils from '@/users/util';
  import cdAttendee from './cd-attendee';
  import EventService from './service';

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
        parents: {},
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
          sortable: ['name', 'parent', 'ticketName', 'ticketType', 'sessionName', 'status', 'created'],
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
            actions: '',
          },
          highlightMatches: true,
          filterByColumn: true,
          filterable: ['name', 'parent', 'ticketName', 'ticketType', 'sessionName'],
          dateFormat: 'DD/MM HH:mm', // TODO i18n? moment?
          listColumns: this.listColumns,
          columnsClasses: {
            notes: 'cd-event-applications__notes-cell',
            status: 'cd-event-applications__status-cell',
          },
          skin: 'table table-striped table-hover',
          descOrderColumn: 'applicationDate',
        };
      },
      tableData() {
        if (this.applications && this.applications.results) {
          return this.applications.results.map((a) => {
            const { id, name, dateOfBirth, userId, notes, ticketName, ticketType, created, status } = a;
            return Object.assign({
              sessionName: this.sessions[a.sessionId].name,
            }, {
              id,
              userId,
              name,
              parent: this.parents && this.parents[userId],
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
        }
        return [];
      },
      groupMeta() {
        return this.event && this.event.sessions ? this.event.sessions.map(s => ({
          value: s.name,
          data: {
            qty: s.tickets.reduce((qty, t) => qty + t.quantity, 0),
            booked: (this.applications.results.filter(a => a.sessionId === s.id)).length,
          },
        })) : [];
      },
      tickets() {
        let tickets = [];
        if (this.event && this.event.sessions) {
          if (this.filteredOnSession) {
            tickets = (this.event.sessions.find(s => s.name === this.filteredOnSession)).tickets;
          } else {
            tickets = flatten(this.event.sessions.map(s => s.tickets));
          }
        }
        return tickets;
      },
      sessions() {
        // eslint-disable-next-line no-param-reassign
        const reducer = (sessions, el) => { sessions[el.id] = el; return sessions; };
        return this.event.sessions.reduce(reducer, {});
      },
      tableColumns() {
        const columns = ['name', 'parent', 'ticketName', 'ticketType', 'status', 'created'];
        // TODO : do we need age, really ?
        // let columns = ['name', 'parent', 'ticketName','ticketType', 'status', 'age', 'created', ]
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
          };
        }
        return {};
      },
      hasCustomNotes() {
        if (this.applications && this.applications.results) {
          return !this.applications.results.every(a => !this.isCustomNote(a.notes));
        }
        return true;
      },
      groupBy() {
        if (this.event && this.event.sessions && this.event.sessions.length > 1
          && !this.tableOrdered) {
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
      /* toggleGrouping() {
        this.tableColumns.groupBy = this.tableColumns.groupBy ? false : 'sessionName';
      }, */
      getParents() {
        // TODO : filter if child?
        this.applications.results.map(a =>
          UserService.parentsOf(a.userId)
          .then((res) => { 
            this.parents[a.userId] = res.body[0]; 
            const row = this.$refs.applicationTable.data.findIndex((row) => row.userId === a.userId);
            this.$refs.applicationTable.data[row].parent = res.body[0];
          }),
        );
        
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
      delete(applicationId) {
        // TODO: 
      },
      contact(userId) {
        // TODO:
      },
    },
    components: {
      cdAttendee,
      Dropdown,
    },
    async created() {
      this.dojoId = this.$route.params.dojoId;
      this.eventId = this.$route.params.eventId;
      const data = await Promise.all([
        EventService.v3.load(
          this.dojoId,
          this.eventId,
          {
            params: {
              related: 'sessions.tickets',
            },
          },
        ),
        EventService.v3.applications.list(
          this.dojoId,
          this.eventId,
        ),
      ]);
      this.event = data[0].body;
      this.applications = data[1].body;
      this.getParents();
    },
  };
</script>
<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
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
        background-color: @cd-purple;
        color: @cd-white;
      }
      &-title {
        flex: 1;
        padding: 6px;
        font-weight: 800;
        &-actions {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          padding: 8px;
          background-color: @cd-white;
          color: @cd-purple;
          border-bottom: 8px solid @cd-purple;
          .fa {
            padding: 6px;
          }
        }
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
    &__avatar {
      display: inline-block;
      background-image: url(/img/avatar.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      border-radius: 100%;
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
  }
</style>
<style lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  .cd-event-applications {
    &__table {
      .table {
        &>tbody {
          &>tr {
            &.info {
              font-weight: bold;
              text-align: center;
              &>td {
                color: @cd-white;
                background-color: @cd-purple !important;
              }
            }
            &>td {
              padding: 4px;
              vertical-align: baseline;
            }
          }
        
          .dropdown-toggle {
            padding-left: 4px;
            padding-right: 4px;
          }
        }
      }
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
</style>
