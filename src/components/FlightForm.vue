<template>
    <v-form>
        <v-row>
            <v-col cols="12" sm="2">
                <!-- ID -->
                <v-text-field v-model="flight.id" readonly variant="outlined" label="ID" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Date -->
                <v-text-field v-model="flight.date" readonly variant="outlined" label="Date" type="date" required></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1">
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Departure -->
                <v-text-field v-model="flight.departure" label="Departure" required autocomplete="false" @update:model-value="getAirportData('departure')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Arrival -->
                <v-text-field v-model="flight.arrival" label="Arrival" required autocomplete="false" @update:model-value="getAirportData('arrival')"></v-text-field>
            </v-col>

        </v-row>

        <v-row>
            <!-- Captain -->
            <v-col cols="12" sm="3">
                <v-text-field v-model="flight.captain" label="Captain" clearable></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
                <!-- Aircraft Registration -->
                <v-combobox 
                    clearable 
                    v-model="flight.aircraftReg" 
                    label="Aircraft Reg" 
                    required 
                    @update:model-value="handleAircraftRegUpdate"
                    :items="aircraftRegs"
                ></v-combobox>
            </v-col>
            <v-col cols="12" sm="5">
                <!-- Aircraft Type -->
                <v-text-field v-model="flight.aircraftType" label="Aircraft Type" required></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <!-- Departure Time -->
                <v-text-field v-model="flight.departureTime" label="Departure Time" format="24hr" required
                    type="datetime-local" @update:model-value="updateDate($event, 'departure')" @blur="assignTemporaryDepartureTime()"></v-text-field>
                </v-col>
                
            <v-col cols="12" sm="6">
                <!-- Arrival Time -->
                <v-text-field v-model="flight.arrivalTime" label="Arrival Time" format="24hr" required
                    type="datetime-local" @update:model-value="updateDate($event, 'arrival')"></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="3">
                <!-- Multi Pilot Time -->
                <v-checkbox v-model="flight.multiPilotTime" label="Multi Pilot Time" true-value="true"
                    false-value="false"></v-checkbox>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Single Engine Time -->
                <v-text-field v-model="flight.singleEngineTime" label="Single Engine Time" format="24hr" @update:focused="setEngineTime('singleEngineTime')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Multi Engine Time -->
                <v-text-field v-model="flight.multiEngineTime" label="Multi Engine Time" format="24hr"  @update:focused="setEngineTime('multiEngineTime')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Total Time -->
                <v-text-field v-model="flight.totalTime" label="Total Time" format="24hr"></v-text-field>
            </v-col>
        </v-row>

        <v-row>

            <v-col cols="12" sm="3">
                <!-- Take Offs (Day) -->
                <v-text-field v-model="flight.takeOffsDay" label="T-Offs / Day" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="flight.takeOffsDay++" @click:prependInner="flight.takeOffsDay--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Landings (Day) -->
                <v-text-field v-model="flight.landingDay" label="Lndgs / Day" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="flight.landingDay++" @click:prependInner="flight.landingDay--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Take Offs (Night) -->
                <v-text-field v-model="flight.takeOffsNight" label="T-Offs / Night" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="flight.takeOffsNight++" @click:prependInner="flight.takeOffsNight--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Landings (Night) -->
                <v-text-field v-model="flight.landingNight" label="Lndgs / Night" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="flight.landingNight++" @click:prependInner="flight.landingNight--">
                </v-text-field>
            </v-col>
        </v-row>

        <v-card-actions>OPS Time</v-card-actions>

        <v-row>
            <v-col cols="6" sm="4" md="2">
                <!-- Night Time -->
                <v-text-field v-model="flight.nightTime" label="Night Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- IFR Time -->
                <v-text-field v-model="flight.ifrTime" label="IFR Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- PIC Time -->
                <v-text-field v-model="flight.pic" label="PIC Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- SIC Time -->
                <v-text-field v-model="flight.sic" label="SIC Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- Dual Time -->
                <v-text-field v-model="flight.dual" label="Dual Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- Instructor Time -->
                <v-text-field v-model="flight.instructor" label="FI Time" format="24hr"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6">
                <!-- Remarks -->
                <v-textarea v-model="flight.remarks" label="Remarks"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
                <FlightMap v-if="showMap" :flight="flight"></FlightMap>
            </v-col>
        </v-row>

        <v-card-actions>
            <!-- Submit button -->
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" dark v-bind="props">Submit</v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline">Are you sure?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
                        <v-btn color="green darken-1" text @click="submitForm">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>
    </v-form>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { getNightFlightTime } from '@/helpers/time';
import { mapActions, mapState } from 'pinia';
import { useLogbookStore } from '@/stores/logbook';
import FlightMap from '@/components/FlightMap.vue'

export default {
    name: "FlightForm",
    data() {
        return {
            departureAirportData: null,
            arrivalAirportData: null,
            temporaryDepartureDateTime: null,
            dialog: false
        }
    },
    props: {
        flight: {
            type: Object as PropType<Flight>,
            required: true
        }
    },
    computed: {
        ...mapState(useLogbookStore, {
            flights: 'flights',
            aircraftRegs: 'aircraftRegs',
            aircraftTypes: 'aircraftTypes',
            getAirportByIcaoCode: 'getAirportByIcaoCode'
        }),
        newFlightId() {
            return this.flights.length
        },
        showMap() {
            return this.flight.departure.length > 3 
                && this.flight.arrival.length > 3
                && this.flight.arrival !== this.flight.departure
        }
    },
    watch: {
        newFlightId(newVal) {
            if (!this.flight?.id && this.flight.id !== 0) {
                this.flight.id = newVal
            }
        }
    },
    methods: {
        ...mapActions(useLogbookStore, ['pushFlight']),
        async submitForm() {
            this.flight.takeOffsDay = Number(this.flight.takeOffsDay)
            this.flight.landingDay = Number(this.flight.landingDay)
            this.flight.takeOffsNight = Number(this.flight.takeOffsNight)
            this.flight.landingNight = Number(this.flight.landingNight)
            await this.pushFlight(this.flight)
            this.$router.push({ path: `/logbook/${this.flight.id}`});
        },
        updateTotalTime() {
            const { arrivalTime, departureTime } = this.flight;
            if(arrivalTime && departureTime) {
                const departureDate = new Date(departureTime);
                const arrivalDate = new Date(arrivalTime);
                
                // Calculate the time difference in milliseconds
                const timeDifference = arrivalDate.getTime() - departureDate.getTime();

                // Convert milliseconds to hours and minutes
                const totalMinutes = Math.floor(timeDifference / (1000 * 60));
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                // Format the result as HH:MM
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                this.flight.totalTime = formattedTime
            }
        },
        updateNightTime() {
            const { departureTime, arrivalTime } = this.flight;
            if(departureTime && arrivalTime && this.departureAirportData && this.arrivalAirportData) {
                const departureDate = new Date(departureTime);
                const arrivalDate = new Date(arrivalTime);
                const nightTime = getNightFlightTime(this.flight, this.departureAirportData, this.arrivalAirportData)
                this.flight.nightTime = nightTime !== '00:00' ? nightTime : null
            }
        },
        setEngineTime(engine: string) {
            if(engine === 'singleEngineTime') {
                this.flight.multiEngineTime = null
                this.flight.singleEngineTime = this.flight.totalTime
            } else if(engine === 'multiEngineTime') {
                this.flight.multiEngineTime = this.flight.totalTime
                this.flight.singleEngineTime = null
            }
        },
        async getAirportData(type: string) {
            const airport = type === 'departure' ? this.flight.departure : this.flight.arrival
            if(airport.length > 3) {
                const data = await this.getAirportByIcaoCode(airport)
                if(data) {
                    this[`${type}AirportData`] = data
                    this.updateNightTime()
                }
            }
        },
        updateDate(val: string, type: string) {
            if(type === 'departure') {
                this.flight.date = val.split('T')[0]
                !this.flight.arrivalTime ? this.temporaryDepartureDateTime = val : null
            }
            this.updateTotalTime()
            this.updateNightTime()
        },
        handleAircraftRegUpdate(val: unknown) {
            if (typeof val === 'string') {
                this.updateType(val);
            }
        },
        updateType(val: string) {
            const aircraftType = this.flights.find((f: Flight) => f.aircraftReg === val)?.aircraftType;
            if (aircraftType) {
                this.flight.aircraftType = aircraftType;
            }
        },
        assignTemporaryDepartureTime() {
            if(this.temporaryDepartureDateTime && !this.flight.arrivalTime) {
                this.flight.arrivalTime = this.temporaryDepartureDateTime
                this.temporaryDepartureDateTime = null
            }
        }
    },
    components: { FlightMap }
};
</script>