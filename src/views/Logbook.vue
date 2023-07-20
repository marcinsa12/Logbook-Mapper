<template>
  <v-card dark>
    <v-card-title>
      <v-btn class="ma-2 btn-block" @click="expandFilters = !expandFilters"
        :append-icon="expandFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'">Filters</v-btn>
      <v-expand-transition>
        <div v-show="expandFilters">
          <v-divider></v-divider>
          <!-- @vue-ignore -->
          <v-select :items="headers || []" v-model="headersToDisplay" item-title="title" return-object multiple
            label="Select fields to display"></v-select>

          <FiltersToDisplay :filters="filters">
          </FiltersToDisplay>
        </div>
      </v-expand-transition>
    </v-card-title>

    <v-data-table :headers="headersToDisplay" :items="flightsToDisplay" v-model:items-per-page="itemsPerPage"
      class="flights-table elevation-1" item-key="id" fixed-header @update:page="page = $event"
      @update:options="sortFlightArray($event)">
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="header in headersToDisplay">
            {{ renderItem(item.raw[header.key], header.key) }}
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-card-actions>
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

    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { mapState, mapWritableState } from 'pinia';
import { useLogbookStore } from '@/stores/logbook';
import FiltersToDisplay from '@/components/FiltersToDisplay.vue';
import { flightTypes } from '@/assets/constants'

export default {
  data() {
    return {
      activeFilters: null,
      itemsPerPage: 10,
      page: 1,
      search: "",
      applicableFlightFilters: flightTypes,

      expandFilters: false,
    };
  },
  computed: {
    // @ts-ignore
    ...mapState(useLogbookStore, {
      flightsToDisplay: (state: LogbookGetters) => state.flightsToDisplay,
      getAirportByIcaoCode: (state: LogbookGetters) => state.getAirportByIcaoCode,
      totalFlownDistance: (state: LogbookGetters) => state.totalFlownDistance,
      aircraftRegs: (state: LogbookGetters) => state.aircraftRegs,
      aircraftTypes: (state: LogbookGetters) => state.aircraftTypes,
      headers: (state: LogbookState) => state.headers,
    }),
    // @ts-ignore
    ...mapWritableState(useLogbookStore, {
      headersToDisplay: "headersToDisplay",
      flights: "flights"
    }),
    totalTimeCurrentPage(): string {
      const flightsOnPage = this.itemsPerPage <= 0
        ? this.flightsToDisplay
        : this.flightsToDisplay.slice(
          (this.page - 1) * this.itemsPerPage,
          this.page * this.itemsPerPage
        );
      const totalTimeOnPage = flightsOnPage?.reduce(
        (total, flight) => total + this.getMinutesFromDate(flight.totalTime),
        0
      ) || 0;
      return `${Math.floor(totalTimeOnPage / 60)}:${totalTimeOnPage % 60}`;
    },
    totalTime(): string {
      const totalTime = this.flightsToDisplay?.reduce(
        (total, flight) => total + this.getMinutesFromDate(flight.totalTime),
        0
      ) || 0;
      return `${Math.floor(totalTime / 60)}:${totalTime % 60}`;
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
    getMinutesFromDate(date: Date) {
      try {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        return hours * 60 + minutes;
      } catch (error) {
        return 0
      }
    },
    getStartPoint() {
      return (this.page - 1) * this.itemsPerPage;
    },
    renderItem(item: any, key: string) {
      if (key === "date") {
        return item.toISOString().split("T")[0];
      }
      ;
      return item instanceof Date ? item.toISOString().split("T")[1].slice(0, 5) : item;
    }
  },
  components: { FiltersToDisplay }
}
</script>

<style>
@media (min-width: 1024px) {
  .flights-table {
    height: 49vh;
  }
}
</style>
