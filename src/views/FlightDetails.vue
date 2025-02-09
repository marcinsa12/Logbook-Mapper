<template>
    <v-card>
        <v-card-title>
            <v-row>
                <v-col cols="4" sm="6">
                    <h2 v-if="flightId !== 'new'"> Flight {{ flightId }} </h2>
                    <h2 v-if="flightId === 'new'"> Log new Flight </h2>
                </v-col>
                <v-col cols="4" sm="3">
                    <v-btn v-if="flightId != 'new' && Number(flightId) !== 0" block prepend-icon="mdi-arrow-left" @click="previousPage">Prev</v-btn>
                </v-col>
                <v-col cols="4" sm="3">
                    <v-btn v-if="flightId != 'new' && !isLastFlight" block append-icon="mdi-arrow-right" @click="nextPage">Next</v-btn>
                    <v-btn v-if="flightId != 'new' && isLastFlight" block @click="$router.push({ path: `/logbook/new` })" color="secondary">New Flight</v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <v-spacer></v-spacer>

        <v-card-text>
            <FlightForm :flight="flight"></FlightForm>

        </v-card-text>
    </v-card>
</template>
  
<script lang="ts">
import { mapState } from 'pinia';
import { useLogbookStore } from '@/stores/logbook';
import FlightForm from '@/components/FlightForm.vue';
import { newFlightData } from '@/helpers/flight'

const logbookStore = useLogbookStore()

export default {
    data() {
        return {
            flight: newFlightData
        };
    },
    computed: {
        flight(): Flight {
            if (this.flightId === 'new') {
                return {
                    id: logbookStore.flights.length,
                    date: '',
                    departure: '',
                    departureTime: '',
                    arrival: '',
                    arrivalTime: '',
                    aircraftType: '',
                    aircraftReg: '',
                    singleEngineTime: '',
                    multiEngineTime: '',
                    multiPilotTime: false,
                    totalTime: '',
                    captain: '',
                    takeOffsDay: 0,
                    landingDay: 0,
                    takeOffsNight: 0,
                    landingNight: 0,
                    nightTime: '',
                    ifrTime: '',
                    pic: '',
                    sic: '',
                    dual: '',
                    instructor: '',
                    remarks: ''
                }
            }
            return this.flightMonitor
        },
        flightMonitor() {
            return logbookStore.getFlight(Number(this.flightId)) || Object.assign(newFlightData, { id: logbookStore.flights.length })
        },

        isLastFlight() {
            return logbookStore.flights.length-1 === Number(this.flightId)
        },
        
        flightId() {
            return this.$route.params.id === 'new'
                ? 'new'
                : Number(this.$route.params.id)
        } 
    },
    watch: {
        flightMonitor(newVal) {
            this.flight = Object.assign({}, newVal)
        }
    },
    mounted() {
        this.flight = Object.assign({}, this.flightMonitor)
        if(this.flightId === 'new') {
            this.flight.id = logbookStore.flights.length
        }
    },
    methods: {
        previousPage() {
            const prevFlight = Number(this.flightId) - 1;
            this.$router.push({ path: `/logbook/${prevFlight}` });
        },
        nextPage() {
            const nextFlight = Number(this.flightId) + 1;
            this.$router.push({ path: `/logbook/${nextFlight}` });
        }
    },
    components: { FlightForm }
}
</script>
  
<style>
@media (min-width: 1024px) {
    .flights-table {
        height: 49vh;
    }
}
</style>
  