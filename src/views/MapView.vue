<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        Your Flights on the map
      </div>
      <span v-if="mapDrawn">(You've flown a total of {{ totalFlownDistance.toFixed() || 0 }} NM! on these flights)</span>
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

import { drawLineWithArrow } from '@/helpers/map';

export default {
  name: 'Map',
  data() {
      return {
          mapEntity: {},
          mapDrawn: false
      }
  },
  computed: {
    // @ts-ignore
    ...mapState(useLogbookStore, {
        flights: (state: LogbookState) => state.flights,
        flightsToDisplay: (state: LogbookGetters) => state.flightsToDisplay,
        getAirportByIcaoCode: (state: LogbookGetters) => state.getAirportByIcaoCode,
        totalFlownDistance: (state: LogbookGetters) => state.totalFlownDistance,
    }),
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
      let ftd = this.flights.length > this.flightsToDisplay.length ? this.flightsToDisplay : this.flights as []
      ftd.forEach(async ({departure, arrival}) => {
        if(departure != arrival) {
          let from = await this.getAirportByIcaoCode(departure) || `${departure} airport`
          let to = await this.getAirportByIcaoCode(arrival) || `${arrival} airport`
          if(from && to) {
            console.log(this)
            drawLineWithArrow(from, to, this.mapEntity)
          }
        }
      })
      this.mapDrawn = true
    }
  }
};
</script>

<style>
#map {
  max-width: 95vw;
  width: 100%;
  height: 60vh;
  display: block;
}
</style>