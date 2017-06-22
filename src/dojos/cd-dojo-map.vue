<template>
  <div>
    <google-map :options="{styles: mapStyles}" :center="{lat: center.latitude, lng: center.longitude}" :zoom="12" style="width: 100%;height: 400px;">
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
        coords.lat = dojo.geoPoint ? dojo.geoPoint.lat : dojo.geo_point.lat;
        coords.lng = dojo.geoPoint ? dojo.geoPoint.lon : dojo.geo_point.lon;
        return coords;
      },
    },
  };
</script>
