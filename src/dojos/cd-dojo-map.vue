<template>
  <div>
    <google-map :options="{styles: mapStyles}" :center="{lat: center.latitude, lng: center.longitude}" :zoom="12" style="width: 100%;height: 400px;">
      <google-marker v-for="dojo in dojos" :key="dojo.id" :position="getMarkerPosition(dojo)" :icon="pinIcon"></google-marker>
    </google-map>
  </div>
</template>
<script>
  import pinIcon from '@/assets/cd-dojo-pin.svg';
  import { Map, Marker } from 'vue2-google-maps';

  export default {
    name: 'DojoMap',
    props: ['dojos', 'center'],
    components: {
      'google-map': Map,
      'google-marker': Marker,
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
      };
    },
    methods: {
      getMarkerPosition(dojo) {
        const coords = {};
        coords.lat = dojo.geoPoint ? dojo.geoPoint.lat : dojo.geo_point.lat;
        coords.lng = dojo.geoPoint ? dojo.geoPoint.lon : dojo.geo_point.lon;
        return coords;
      },
    },
  };
</script>
