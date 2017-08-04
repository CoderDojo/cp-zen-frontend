<template>
  <div>
    <google-map :options="{styles: mapStyles}" :center="{lat: center.latitude, lng: center.longitude}" :zoom="12" class="cd-dojo-map__map">
      <google-marker v-for="dojo in dojos" :key="dojo.id" @click="updateInfoWindow(dojo)" :position="getMarkerPosition(dojo)" :icon="pinIcon"></google-marker>
      <google-info-window v-if="selectedDojo" :position="getMarkerPosition(selectedDojo)" :options="{pixelOffset: {width: 0, height: -40}}" :opened="infoWindowOpened" @closeclick="infoWindowOpened = false">
        <dojo-map-info-window :dojo="selectedDojo"></dojo-map-info-window>
      </google-info-window>
    </google-map>
  </div>
</template>
<script>
  import { Map, Marker, InfoWindow } from 'vue2-google-maps';
  import pinIcon from '@/assets/cd-dojo-pin.svg';
  import DojoMapInfoWindow from './cd-dojo-map-info-window';

  export default {
    name: 'DojoMap',
    props: ['dojos', 'center'],
    components: {
      'google-map': Map,
      'google-marker': Marker,
      'google-info-window': InfoWindow,
      DojoMapInfoWindow,
    },
    data() {
      return {
        pinIcon,
        mapStyles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [
              { visibility: 'off' },
            ],
          },
        ],
        selectedDojo: null,
        infoWindowOpened: false,
      };
    },
    methods: {
      updateInfoWindow(dojo) {
        this.selectedDojo = dojo;
        this.infoWindowOpened = true;
      },
      getMarkerPosition(dojo) {
        const coords = {};
        const geoPoint = dojo.geoPoint || dojo.geo_point;
        if (geoPoint) {
          coords.lat = geoPoint.lat;
          coords.lng = geoPoint.lon;
        }
        return coords;
      },
    },
  };
</script>

<style scoped lang="less">
  @import "../common/variables";

  .cd-dojo-map {
    &__map {
      width: 100%;
      height: 400px;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dojo-map {
      &__map {
        height: 300px;
      }
    }
  }
</style>
