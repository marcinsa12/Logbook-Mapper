<template>
  <v-card>
    <v-card-title primary-title>
      Your Flight on the map
    </v-card-title>
    <v-card-text>
      <div id="map"></div>
    </v-card-text>
    <v-btn block color="primary" dark @click="drawFlightMap">Draw a flight map</v-btn>
  </v-card>
</template>

<script lang="ts">
import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { Tile } from 'ol/layer'
import { OSM } from 'ol/source'
import Map from 'ol/Map'

import { useLogbookStore } from '@/stores/logbook';
import { mapState } from 'pinia';

export default {
  name: 'Map',
  data() {
      return {
          mapEntity: {}
      }
  },
  computed: {
    ...mapState(useLogbookStore, ["flights", "getAirportByIcaoCode"])
  },
  mounted() {
    const map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    this.mapEntity = map;
  },
  methods: {
    drawFlightMap() {
      this.flights.forEach(({departure, arrival}) => {
        if(departure != arrival) {
          let from = this.getAirportByIcaoCode(departure) || `${departure} airport`
          let to = this.getAirportByIcaoCode(arrival) || `${arrival} airport`
          if(from && to) {
            this.drawLineWithArrow(from, to, this.mapEntity)
          }
        }
      })
    }
  }
};
</script>

<style>
#map {
  min-width: 95vw;
  height: 80vh;
  display: block;
}
</style>