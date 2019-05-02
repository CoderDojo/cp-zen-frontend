<template>
  <div class="cd-dashboard__anniversaries">
    <div v-for="dojo in filteredDojos" class="cd-dashboard__anniversary">
      <span class="cd-dashboard__anniversary-popper">🎉</span>
      <a :href="`https://docs.google.com/forms/d/e/1FAIpQLScNDxfs7MP4aOA9f8iZPTuNl6NVO2RHpIch5VGwUDiupaGOxA/viewform`" v-ga-track-exit-nav>{{ $t('{dojoName}\'s Dojo anniversary is approaching - apply now for your FREE birthday pack to celebrate', { dojoName: dojo.name }) }}</a>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'cd-dashboard-dojo-anniversary',
    props: ['dojos', 'dojoAdmins'],
    data() {
      return {
        filteredDojos: [],
      };
    },
    methods: {
      hasAnniversary(dojo) {
        const now = moment();
        const creationDate = moment(dojo.created);
        const referenceDate = moment(creationDate);
        referenceDate.year(now.year());
        const timeToAnniversary = referenceDate.diff(now, 'months');
        return timeToAnniversary >= -2 && timeToAnniversary <= 0;
      },
      championOfDojos(dojos, dojoAdmins) {
        return dojoAdmins.reduce((acc, membership) => {
          if (dojos[membership.dojoId]) acc.push(dojos[membership.dojoId]);
          return acc;
        }, []);
      },
      isOld(dojo) {
        const difference = moment(dojo.created).diff(moment(), 'month');
        return difference <= -10;
      },
      dojosWithUpcomingAnniversary(dojos) {
        // Note: that could also be filtered with a modulo of 12 months
        return dojos.filter(dojo => this.hasAnniversary(dojo) && this.isOld(dojo));
      },
    },
    created() {
      const isChampionOfDojos = this.championOfDojos(this.dojos, this.dojoAdmins);
      this.filteredDojos = this.dojosWithUpcomingAnniversary(isChampionOfDojos);
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/variables";

  .cd-dashboard{
    &__anniversary {
      text-align: center;
      margin-bottom: @margin;
      a {
        color: @cd-white;
        text-decoration: underline;
        i {
          margin-right: 8px;
        }
      }
      &-popper {
        font-size: 2em;
      }
    }
  }
</style>
