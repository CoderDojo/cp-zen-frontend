<template>
  <div class="cd-dashboard__anniversaries">
    <div v-for="dojo in filteredDojos" class="cd-dashboard__anniversary">
      <span class="cd-dashboard__anniversary-popper">🎉</span>
      <a :href="formUrl(dojo)">{{ $t('{dojoName}, your Dojo anniversary is approaching! Apply now for your FREE birthday pack to celebrate', { dojoName: dojo.name }) }}</a>
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
    computed: {
      baseUrl() {
        return `${window.location.protocol}//${window.location.hostname}`;
      },
    },
    methods: {
      formUrl(dojo) {
        const url = `${this.baseUrl}/dojos/${dojo.urlSlug}`;
        return `https://docs.google.com/forms/d/e/1FAIpQLScNDxfs7MP4aOA9f8iZPTuNl6NVO2RHpIch5VGwUDiupaGOxA/viewform?entry.803640143=${dojo.name}&entry.2104926148=${url}`;
      },
      hasAnniversary(dojo) {
        const now = moment();
        const nextAnniversary = moment(dojo.created);
        nextAnniversary.year(now.year());
        if (now.isAfter(nextAnniversary)) {
          nextAnniversary.add(1, 'year');
        }
        const timeToAnniversary = nextAnniversary.diff(now, 'months');
        // Note: this won't be exact due to the user's tz and the creation date being in IST
        return timeToAnniversary <= 2;
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
        font-size: @font-size-medium;
        i {
          margin-right: 8px;
        }
      }
      &-popper {
        color: @cd-orange;
        font-size: 1.5em;
      }
    }
  }
</style>
