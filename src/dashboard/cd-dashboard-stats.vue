<template>
  <div class="column">
    <div class="cd-dashboard-stats">
      <h1 class="cd-dashboard-stats__header">{{ $t('Dojo Stats') }}</h1>
      <div class="cd-dashboard-stats__number">
        <div class="cd-dashboard-stats__number-value"><span>{{ bookedChildren }}</span></div>
        <div class="cd-dashboard-stats__description">{{ $t('kids attended your events') }}</div>
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
        bookedChildren: 0,
      };
    },
    computed: {
      ...mapGetters(['loggedInUser']),
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
    },
    async created() {
      await this.getDojos();
      await this.getBookedChildren();
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
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-stats {
      max-width: 100%;
    }
  }
</style>

