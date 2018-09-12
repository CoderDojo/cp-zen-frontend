<template>
  <div class="column">
    <div class="cd-dashboard-stats">
      <h3 class="cd-dashboard-stats__header">{{ $t('Dojo stats') }}</h3>
      <hr class="cd-dashboard-stats__divider visible-xs"/>
      <h4 class="cd-dashboard-stats__category">{{ $t('Youth') }}</h4>
      <div class="cd-dashboard-stats__charts" v-if="chartsAreVisible">
        <div class="cd-dashboard-stats__chart-number" v-if="numberChartIsReady">
          <span class="cd-dashboard-stats__description" v-html="$t('{numKids} kids attended your events', { numKids: numberStatText })"></span>
        </div>
        <div v-else class="cd-dashboard-stats__chart-number--filler cd-filler cd-filler--grey-bg"/>
        <div class="cd-dashboard-stats__chart-pie" v-if="pieChartIsReady">
          <div class="cd-dashboard-stats__circle">
            <svg viewBox="0 0 32 32">
              <g v-for="gender in genderStats">
                <circle r="16" cx="16" cy="16" :style="{ strokeDashoffset: -gender.prevValue, strokeDasharray: `${gender.perc} 100`}"
                   :class="[`cd-dashboard-stats__circle--${gender.name}`]">
                </circle>
              </g>
            </svg>
            <div class="cd-dashboard-stats__circle-legends">
              <div v-for="gender in genderStats" class="cd-dashboard-stats__circle-legend">
                <div class="cd-dashboard-stats__circle-legend-color" :class="[`cd-dashboard-stats__circle--${gender.name}`]"></div>
                <div> {{ $t(gender.name) }}</div>
              </div>
            </div>
          </div>
          <div v-if="femaleHintIsVisible" class="cd-dashboard-stats__chart-pie-hint">
            <a href="https://help.coderdojo.com/hc/en-us/articles/360001143123-Increasing-the-percentage-of-girls-in-your-Dojo-">{{ $t('More information about girls in Dojos') }}</a>
          </div>
        </div>
        <div v-else class="cd-dashboard-stats__chart-pie--filler cd-filler cd-filler--grey-bg"/>
      </div>
      <div v-else>
        <p>{{ $t('No statistics are available at the moment.') }}
        {{ $t('The more Zen is used, the more you\'ll find about your Dojo!') }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DojoService from '@/dojos/service';
  import EventsService from '@/events/service';
  
  export default {
    name: 'cd-dashboard-stats',
    data() {
      return {
        dojos: null,
        dojoId: null,
        dojoUsers: null,
        genders: null,
        bookedChildren: null,
      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      chartsAreVisible() {
        return (this.bookedChildren === null || this.bookedChildren.length !== 0) &&
          ((this.dojoUsers === null || this.dojoUsers.length !== 0) &&
            (this.genders === null || this.genders.length !== 0));
      },
      pieChartIsReady() {
        return (this.dojoUsers !== null && this.dojoUsers.length > 0) ||
          (this.genders !== null && this.genders.length > 0);
      },
      numberChartIsReady() {
        return this.bookedChildren !== null;
      },
      numberStatText() {
        return `<span class="cd-dashboard-stats__chart-number-value">${this.bookedChildren}</span>`;
      },
      femaleHintIsVisible() {
        const femaleStats = this.genderStats.find(g => g.name === 'Female');
        return (femaleStats && femaleStats.perc ? femaleStats.perc : 0) < 30;
      },
      totalChildren() {
        return this.dojoUsers ? this.dojoUsers.length : 1;
      },
      genderStats() {
        let prevValue = 0;
        return Object.entries(this.genders)
          .reduce((acc, gender) => {
            const perc = (gender[1] / this.totalChildren) * 100;
            acc.push({
              nb: gender[1],
              name: gender[0],
              perc,
              prevValue,
            });
            prevValue += perc;
            return acc;
          }, []);
      },
    },
    methods: {
      async getDojos() {
        const dojos = (await DojoService.getUsersDojos(this.loggedInUser.id)).body;
        this.dojos = dojos.filter(dojo => dojo.userTypes.includes('champion'));
        // TODO : drop-down dojo selection
        this.dojoId = this.dojos.length ? this.dojos[0].dojoId : null;
      },
      async getBookedChildren() {
        this.bookedChildren = (await EventsService.searchApplicationsByDojo(
          this.dojoId,
          { deleted: 0, ticketType: 'ninja', status: { ne$: 'cancelled' } },
        )).body.length;
      },
      async getDojoUsers() {
        let dojoUsers = (await DojoService.getDojoUsers(this.dojoId, { userType: 'attendee-u13', fields: ['gender'] })).body.response;
        dojoUsers = dojoUsers.concat((await DojoService.getDojoUsers(this.dojoId, { userType: 'attendee-o13', fields: ['gender'] })).body.response);
        this.genders = dojoUsers.reduce((red, user) => {
          const gender = user.gender === null ? 'Undisclosed' : user.gender;
          if (!red[gender]) {
            // eslint-disable-next-line no-param-reassign
            red[gender] = 1;
          } else {
            // eslint-disable-next-line no-param-reassign
            red[gender] += 1;
          }
          return red;
        }, {});
        this.dojoUsers = dojoUsers;
      },
    },
    async created() {
      await this.getDojos();
      // Stat booked number
      await this.getBookedChildren();
      // Stat gender pie-chart
      await this.getDojoUsers();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-filler-loading";
  @import "../common/variables";

  .cd-dashboard-stats {
    background-color: @side-column-grey;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    max-width: 340px;
    display: block; 

    &__header {
      margin: 45px 0 16px 0;
    }
    &__chart {
      &-pie {
        margin-top: 16px;
        &--filler {
          margin-top: 16px;
          background-color: @cd-very-light-grey;
          height: 100px;
          width: 100px;
          border-radius: 50%;
        }
        &-hint {
          margin-top: 8px;
        }
      }
      &-number--filler {
        background-color: @cd-very-light-grey;
        height: @font-size-large;
      }
    }
    &__circle {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      svg {
        width: 100px; height: 100px;
        transform: rotate(-90deg);
        border-radius: 50%;
      }
      circle {
        fill: transparent;
      }
      &-legend {
        display: flex;
      }
      &-legend-color {
        border-radius: 50%;
        height: 8px;
        width: 8px;
        margin-right: 8px;
      }
      &--Male {
        stroke: @cd-purple;
        background-color: @cd-purple;
        stroke-width: 32;
      }
      &--Female {
        stroke: @cd-orange;
        background-color: @cd-orange;
        stroke-width: 32;
      }
      &--Undisclosed {
        stroke: grey;
        background-color: @cd-grey;
        stroke-width: 32;
      }
       
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-stats {
      max-width: 100%;
      &__divider {
        border-color: @divider-grey;
      }
      &__chart {
        &-pie {
          margin: 16px 0;
        }
      }
    }
  }
</style>
<style lang="less">
  @import "../common/variables";
  .cd-dashboard-stats {
     &__chart-number {
      &-value {
        font-weight: bold;
      }
    }
  }
</style>
