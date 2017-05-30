<template>
  <div>
    <h1 class="cd-dojo-details__name">{{dojoDetails.name}}</h1>
    <p class="cd-dojo-details__time">{{dojoDetails.time}}</p>
    <p class="cd-dojo-details__address">{{address}}</p>
    <p class="cd-dojo-details__details" v-html="dojoDetails.notes"></p>
    <p class="cd-dojo-details__email">{{dojoDetails.email}}</p>
    <p class="cd-dojo-details__website">{{dojoDetails.website}}</p>
    <p class="cd-dojo-details__facebook">{{dojoDetails.facebook}}</p>
    <p class="cd-dojo-details__twitter">{{dojoDetails.twitter}}</p>
    <p class="cd-dojo-details__google-group">{{dojoDetails.googleGroup}}</p>

    <events-list v-if="dojoDetails.id" v-bind:dojoId="dojoDetails.id"></events-list>
  </div>
</template>
<script>
  import service from './service';
  import eventsList from '../events/cd-event-list';

  export default {
    name: 'dojo-details',
    components: {
      'events-list': eventsList,
    },
    props: ['country', 'region', 'dojoName'],
    data() {
      return {
        dojoDetails: {},
      };
    },
    computed: {
      address() {
        return !this.dojoDetails.address1 ? undefined : `
          ${this.dojoDetails.address1},
          ${this.dojoDetails.placeName},
          ${this.dojoDetails.countryName}
        `;
      },
      urlSlug() {
        return `${this.country}/${this.region}/${this.dojoName}`;
      },
    },
    methods: {
      loadDojoDetails() {
        service.getByUrlSlug(this.urlSlug).then((response) => {
          this.dojoDetails = response.body;
        }, () => {});
      },
    },
    created() {
      this.loadDojoDetails();
    },
  };
</script>
<style scoped></style>
