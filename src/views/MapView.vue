<template>
  <v-card>
    <v-card-title primary-title>
      <v-row align="center">
        <v-col cols="12" sm="6">
          <div class="text-h6">
            Your Flights on the map
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedYear"
            :items="availableYears"
            label="Select Year"
            density="comfortable"
            class="year-selector"
            @update:model-value="redrawMap"
          ></v-select>
        </v-col>
      </v-row>
      <span v-if="mapDrawn" class="text-subtitle-1">
        (You've flown a total of {{ totalFlownDistance.toFixed() || 0 }} NM! {{ yearDisplay }})
      </span>
    </v-card-title>
    <v-card-text>
      <FlightMap 
        ref="flightMap"
        @update:mapEntity="handleMapEntity"
        :flights="filteredFlights"
        :key="selectedYear"
      ></FlightMap>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import FlightMap from '@/components/FlightMap.vue'
import { useLogbookStore } from '@/stores/logbook';
import { mapState } from 'pinia';

export default {
  name: 'Map',
  data() {
    return {
      mapEntity: null,
      mapDrawn: false,
      selectedYear: 'all'
    }
  },
  computed: {
    // @ts-ignore
    ...mapState(useLogbookStore, {
      flights: (state: LogbookState) => state.flights,
      flightsToDisplay: (state: LogbookGetters) => state.flightsToDisplay,
      totalFlownDistance: (state: LogbookGetters) => state.totalFlownDistance,
    }),

    availableYears() {
      const years = new Set<string>();
      years.add('all');
      
      this.flights.forEach(flight => {
        if (flight.date) {
          const year = new Date(flight.date).getFullYear().toString();
          years.add(year);
        }
      });
      
      return Array.from(years).sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return b.localeCompare(a);
      });
    },

    filteredFlights() {
      console.log('Filtering flights for year:', this.selectedYear);
      if (this.selectedYear === 'all') {
        return this.flightsToDisplay;
      }
      
      const filtered = this.flightsToDisplay.filter(flight => {
        if (!flight.date) return false;
        
        try {
          const flightYear = new Date(flight.date).getFullYear().toString();
          return flightYear === this.selectedYear;
        } catch (error) {
          console.error('Error parsing date for flight:', flight, error);
          return false;
        }
      });

      console.log(`Found ${filtered.length} flights for year ${this.selectedYear}`);
      return filtered;
    },

    flownDistance() {
      // Calculate distance only for filtered flights
      return this.filteredFlights.reduce((total, flight) => {
        return total + (flight.distance || 0);
      }, 0);
    },

    yearDisplay() {
      return this.selectedYear === 'all' 
        ? 'across all years' 
        : `in ${this.selectedYear}`;
    }
  },
  methods: {
    handleMapEntity(map: any) {
      this.mapEntity = map;
      this.mapDrawn = true;
    },
    redrawMap() {
      this.mapDrawn = false;
      
      if (!this.$refs.flightMap) {
        console.warn('FlightMap reference not found');
        return;
      }

      // Force redraw by recreating the map
      // @ts-ignore
      this.$refs.flightMap.resetMap();
      
      this.mapDrawn = true;
    }
  },
  watch: {
    selectedYear: {
      immediate: true,
      handler(newYear) {
        console.log('Year changed to:', newYear);
        this.redrawMap();
      }
    }
  },
  components: { FlightMap }
};
</script>

<style scoped>
.year-selector {
  max-width: 200px;
  margin-left: auto;
}

@media (max-width: 600px) {
  .year-selector {
    max-width: none;
    margin: 1rem 0;
  }
}

#map {
  max-width: 95vw;
  width: 100%;
  height: 60vh;
  display: block;
}
</style>