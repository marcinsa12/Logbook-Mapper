<template>
  <v-card dark class="logbook-card">
    <v-card-title>
      <v-row>
        <v-col cols="5" sm="2">
          <v-btn class="ma-2 btn-block" @click="expand = expand == 'filters' ? null : 'filters'"
            :append-icon="expand == 'filters' ? 'mdi-chevron-up' : 'mdi-chevron-down'">Filters</v-btn>
        </v-col>
        <v-col cols="7" sm="3" class="ml-auto">
          <v-btn class="ma-2 btn-block align-self-end" @click="$router.push({ path: `/logbook/new` })" color="primary">Log new Flight</v-btn>
        </v-col>
      </v-row>
      <v-expand-transition>
        <div v-show="expand == 'filters'">
          <v-divider></v-divider>
          <!-- @vue-ignore -->
          <v-select :items="headers || []" v-model="headersToDisplay" item-title="title" return-object multiple
            label="Select fields to display"></v-select>

          <FiltersToDisplay :filters="filters">
          </FiltersToDisplay>
        </div>
      </v-expand-transition>
    </v-card-title>
    <v-card-text class="table-container pa-4">
      <v-data-table :headers="headersToDisplay" :items="flightsToDisplay" v-model:items-per-page="itemsPerPage"
      class="flights-table elevation-1" item-key="id" fixed-header height="auto" @update:page="page = $event"
      @update:options="sortFlightArray($event)"
      :footer-props="{
        'items-per-page-options': [10, 25, 50, -1]
      }"
      :loading="loading"
      loading-text="Loading flights...">
      <template v-slot:item="{ item }">
        <tr @click="$router.push({ path: `logbook/${item.raw.id}`})">
          <td v-for="header in headersToDisplay">
            {{ renderItem(item.raw[header.key], header.key) }}
          </td>
        </tr>
      </template>
    </v-data-table>
    </v-card-text>

    <v-divider></v-divider>
    
    <v-card-text class="summary-section pa-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-table class="summary-table">
            <thead>
              <tr>
                <th>Total Flight Time:</th>
                <th>Time:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>This Page: </td>
                <td>{{ totalTimeCurrentPage }}</td>
              </tr>
              <tr>
                <td>All Pages: </td>
                <td>{{ totalTime }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-table class="summary-table">
            <thead>
              <tr>
                <th>PIC Flight Time:</th>
                <th>Time:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>This Page: </td>
                <td>{{ totalPICTimeCurrentPage }}</td>
              </tr>
              <tr>
                <td>All Pages: </td>
                <td>{{ totalPICTime }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-table class="summary-table">
            <thead>
              <tr>
                <th>Night Flight Time:</th>
                <th>Time:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>This Page: </td>
                <td>{{ totalNightTimeCurrentPage }}</td>
              </tr>
              <tr>
                <td>All Pages: </td>
                <td>{{ totalNightTime }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia';
import { useLogbookStore } from '@/stores/logbook';
import FiltersToDisplay from '@/components/FiltersToDisplay.vue';
import FlightForm from '@/components/FlightForm.vue';
import { flightTypes } from '@/assets/constants'
import { newFlightData } from '@/helpers/flight'

export default {
  data() {
    return {
      activeFilters: null,
      itemsPerPage: 10,
      page: 1,
      search: "",
      applicableFlightFilters: flightTypes,
      selectedFlight: null,
      newFlightData: Object.assign({}, newFlightData),

      expand: null as string | null,
      loading: false
    };
  },
  computed: {
    ...mapState(useLogbookStore, {
      headers: 'headers',
      headersToDisplay: 'headersToDisplay',
      flightsToDisplay: 'flightsToDisplay',
      getAirportByIcaoCode: (state: LogbookGetters) => state.getAirportByIcaoCode,
      totalFlownDistance: (state: LogbookGetters) => state.totalFlownDistance,
      aircraftRegs: (state: LogbookGetters) => state.aircraftRegs,
      aircraftTypes: (state: LogbookGetters) => state.aircraftTypes,
    }),
    // @ts-ignore
    ...mapWritableState(useLogbookStore, {
      flights: "flights"
    }),
    flightsOnPage (): any[] {
      return this.itemsPerPage <= 0
        ? this.flightsToDisplay
        : this.flightsToDisplay.slice(
          (this.page - 1) * this.itemsPerPage,
          this.page * this.itemsPerPage
        );
    },
    totalTimeCurrentPage(): string {
      const totalTimeOnPage = this.flightsOnPage?.reduce(
        (total, flight) => total + this.getMinutes(flight.totalTime),
        0
      ) || 0;
      return this.formatTime(totalTimeOnPage);
    },
    totalTime(): string {
      const totalTime = this.flightsToDisplay?.reduce(
        (total, flight) => total + this.getMinutes(flight.totalTime),
        0
      ) || 0;
      return this.formatTime(totalTime);
    },
    totalPICTimeCurrentPage(): string {
      const totalTimeOnPage = this.flightsOnPage?.reduce(
        (total, flight) => total + (this.getMinutes(flight.pic) || 0),
        0
      ) || 0;
      return this.formatTime(totalTimeOnPage);
    },
    totalPICTime(): string {
      const totalTime = this.flightsToDisplay?.reduce(
        (total, flight) => total + (this.getMinutes(flight.pic) || 0),
        0
      ) || 0;
      return this.formatTime(totalTime);
    },
    totalNightTimeCurrentPage(): string {
      const totalTimeOnPage = this.flightsOnPage?.reduce(
        (total, flight) => total + (this.getMinutes(flight.nightTime) || 0),
        0
      ) || 0;
      return this.formatTime(totalTimeOnPage);
    },
    totalNightTime(): string {
      const totalTime = this.flightsToDisplay?.reduce(
        (total, flight) => total + (this.getMinutes(flight.nightTime) || 0),
        0
      ) || 0;
      return this.formatTime(totalTime);
    },
    filters() {
      return [
        { name: 'Flight Type', key: 'flightType', values: this.applicableFlightFilters },
        { name: 'Registration', key: 'aircraftReg', values: this.aircraftRegs },
        { name: 'Aircraft type', key: 'aircraftType', values: this.aircraftTypes }]
    },
  },
  methods: {
    sortFlightArray({ sortBy }: any) {
      let flights = this.flights
      if (sortBy) {
        sortBy = sortBy[0]
        const { key, order } = sortBy || {};
        const sortedFlights = flights.sort((a, b) => {
          const valueA = a[key];
          const valueB = b[key];

          if (order === 'asc') {
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
          } else if (order === 'desc') {
            if (valueA > valueB) return -1;
            if (valueA < valueB) return 1;
          }

          return 0;
        });
        this.flights = sortedFlights;
      }
    },
    getMinutes(time: string): number {
      if (!time) return 0;
      try {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      } catch (error) {
        console.warn('Invalid time format:', time);
        return 0;
      }
    },
    formatTime(minutes: number): string {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    },
    getStartPoint() {
      return (this.page - 1) * this.itemsPerPage;
    },
    renderItem(item: any, key: string) {
      
      if (['arrivalTime', 'departureTime'].includes(key)) {
        return item.split("T")[1].concat(' UTC');
      }
      return item
    }
  },
  components: { FiltersToDisplay, FlightForm }
}
</script>

<style>
.logbook-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.flights-table {
  height: 100%;
  max-height: none !important;
}

.v-data-table__wrapper {
  max-height: calc(100vh - 450px);
  overflow-y: auto !important;
}

.summary-section {
  background: rgb(var(--v-theme-surface));
  position: relative;
  z-index: 1;
}

.summary-table {
  width: 100%;
  background: transparent !important;
}

/* Make tables responsive on mobile */
@media (max-width: 600px) {
  .summary-table {
    font-size: 0.9rem;
  }
  
  .v-data-table__wrapper {
    max-height: calc(100vh - 350px);
  }
}

/* Hover effect for flight rows */
.flights-table tbody tr:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
