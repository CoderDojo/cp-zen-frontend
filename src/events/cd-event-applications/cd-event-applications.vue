<template>
  <div class="row cd-event-applications">
    <div class="cd-">
      <header class="cd-event-applications__header">
        <router-link :to="{ path: previousUrl }" replace class="cd-event-applications__header-old-interface">> Go back to previous interface</router-link>
        <div class="cd-event-applications__header-row">
          <h3 class="cd-event-applications__header-title">
            {{ event.name }}
          </h3>
          <div class="cd-event-applications__header-title-actions btn-group">
            <dropdown icon="file-o" align="right" :caret="false">
              <li>
                <a :href="`/api/2.0/events/export-guest-list/dojo/${dojoId}/event/${eventId}/full-export.csv`" target="_blank">Full export</a>
              </li>
              <li>
                <a :href="`/api/2.0/events/export-guest-list/dojo/${dojoId}/event/${eventId}/guest-export.csv`" target="_blank">Guest export</a>
              </li>
              <li>
                <a :href="`/api/2.0/events/export-guest-list/dojo/${dojoId}/event/${eventId}/waiting-export.csv`" target="_blank">Waiting list export</a>
              </li>
            </dropdown>
            <button class="btn btn-default"><i class="fa fa-envelope-o"></i></button>
          </div>
        </div>
      </header>
    </div>
    <div id="people">
      <v-client-table name="applicationTable" ref="applicationTable" :data="data" :columns="tableColumns" :options="tableOptions" @sorted="removeGroupBy" @filter::sessionName="updateSelectableTickets" class="cd-event-applications__table">
        <template slot="__group_meta" scope="{value, data}">
          <span class="cd-event-applications__grouping-header">({{ data.booked }}/{{ data.qty }})</span>
        </template>
        <template slot="parent" scope="props">
          <div v-if="props.row.parent">
            <router-link :to="{ path: profileUrl(props.row.parent.userId) }">{{ props.row.parent.name }}</router-link>
          </div>
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
        <template>
          <tr slot="appendBody" slot-scope="props">
            <td colspan="3">
              <div> {{ $t('Ninjas') }}: {{ nbNinja }} </div>
            </td>
            <td colspan="5">
              <div> {{ $t('Mentors') }}: {{ nbMentor }} </div>
            </td>
          </tr>
        </template>
        <template slot="actions" scope="props">
          <dropdown icon="ellipsis-v" align="right" :caret="false">
            <li @click="delete(props.row.id)"><a><i class="fa fa-times"></i>Delete</a></li>
            <!-- TODO : mailTo -->
            <li @click="contact(props.row.userId)"><a><i class="fa fa-envelope-o"></i>Contact</a></li>
          </dropdown>
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
  import { mapGetters } from 'vuex';
  import Dropdown from '@/common/cd-dropdown';
  import UserService from '@/users/service';
  import cdAttendee from '../cd-attendee';
  import EventService from '../service';
  import Store from './table-store';

  export default {
    name: 'event-applications',
    store: Store,
    data() {
      return {
        dojoId: null,
        eventId: null,
        filteredOnSession: null,
        tableOrdered: false,
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
      ...mapGetters([
        'applications',
        'event',
        'sessions',
        'data',
      ]),
      groupMeta() {
        return this.event && this.event.sessions ? this.event.sessions.map(s => ({
          value: s.name,
          data: {
            qty: s.tickets.reduce((qty, t) => qty + t.quantity, 0),
            booked: (this.applications.filter(a => a.sessionId === s.id)).length,
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
        if (this.applications && this.applications) {
          return !this.applications.every(a => !this.isCustomNote(a.notes));
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
        if (this.applications && this.applications) {
          return (this.applications.filter(a => a.ticketType === 'ninja' && a.deleted === false && a.status === 'approved')).length;
        }
        return 0;
      },
      nbMentor() {
        if (this.applications && this.applications) {
          return (this.applications.filter(a => a.ticketType === 'mentor' && a.deleted === false && a.status === 'approved')).length;
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
        this.applications.map(a =>
          UserService.parentsOf(a.userId)
          .then((res) => { 
            this.$store.commit('parentsOf', { userId: a.userId, data: res.body[0] });
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
        return `/profile/${id}`;
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
      this.$store.commit('event', data[0].body);
      this.$store.commit('applications', data[1].body.results);
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
