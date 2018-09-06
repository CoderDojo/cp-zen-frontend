<template>
  <div class="column">
    <div class="cd-dashboard-stats">
      <h1 class="cd-dashboard-stats__header">{{ $t('Dojo Stats') }}</h1>
      <div class="cd-dashboard-stats__number">
        <div class="cd-dashboard-stats__number-value"><span>{{ bookedChildren }}</span></div>
        <div class="cd-dashboard-stats__description">{{ $t('kids attended your events') }}</div>
      </div>
      <div class="cd-dashboard-stats__pie">
        <div class="cd-dashboard-stats__circle">
          <svg viewBox="0 0 32 32">
            <g v-for="gender in genderStats" >
              <circle r="16" cx="16" cy="16" :style="{ strokeDashoffset: -gender.prevValue, strokeDasharray: `${gender.perc} 100`}"
                :class="['cd-dashboard-stats__circle--' + gender.name]">
              </circle>
            </g>
          </svg>
          <div class="cd-dashboard-stats__circle-legends">
            <div v-for="gender in genderStats" class="cd-dashboard-stats__circle-legend">
              <div class="cd-dashboard-stats__circle-legend-color" :class="['cd-dashboard-stats__circle--' + gender.name]"></div>
              <div stroke="#51c5cf" stroke-width="2px" text-anchor="middle" alignment-baseline="middle"> {{ gender.name }}</div>
            </div>
          </div>
        </div>
        <h4>Gender repartition</h4>
      </div>
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
        p: 50,
        genders: [],
        bookedChildren: 0,

      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
      totalChildren() {
        return this.dojoUsers.length || 1;
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
        this.dojos = (await DojoService.getUsersDojos(this.loggedInUser.id)).body;
        // TODO : drop-down dojo selection
        this.dojoId = (this.dojos[0]).dojoId;
      },
      async getBookedChildren() {
        this.bookedChildren = (await EventsService.searchApplicationsByDojo(
          this.dojoId,
          { deleted: 0, ticketType: 'ninja', status: { ne$: 'cancelled' } },
        )).body.length;
      },
      async getDojoUsers() {
        this.dojoUsers = (await DojoService.getDojoUsers(this.dojoId, { userType: 'attendee-u13', fields: ['gender'] })).body.response;
        this.dojoUsers = this.dojoUsers.concat((await DojoService.getDojoUsers(this.dojoId, { userType: 'attendee-o13', fields: ['gender'] })).body.response);
        this.genders = this.dojoUsers.reduce((red, user) => {
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
  @import "../common/variables";

  .cd-dashboard-stats {
    background-color: @side-column-grey;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    max-width: 340px;
    display:flex;
    flex-direction: column;

    &__header {
      margin: 45px 0 16px 0;
    }
    &__number {
      text-align: center;
      &-value {
        span {
          padding: 8px;
        }
        font-size: @font-size-h3;  
      }
    }
    &__description {
    
    }
    &__pie {
      margin-top: 16px;
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
    }
  }
</style>

