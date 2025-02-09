<template>
    <v-form>
        <v-row>
            <v-col cols="12" sm="2">
                <!-- ID -->
                <v-text-field v-model="localFlight.id" readonly variant="outlined" label="ID" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Date -->
                <v-text-field v-model="localFlight.date" readonly variant="outlined" label="Date" type="date" required></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1">
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Departure -->
                <v-text-field v-model="localFlight.departure" label="Departure" required autocomplete="false" @update:model-value="getAirportData('departure')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Arrival -->
                <v-text-field v-model="localFlight.arrival" label="Arrival" required autocomplete="false" @update:model-value="getAirportData('arrival')"></v-text-field>
            </v-col>

        </v-row>

        <v-row>
            <!-- Captain -->
            <v-col cols="12" sm="3">
                <v-text-field v-model="localFlight.captain" label="Captain" clearable></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
                <!-- Aircraft Registration -->
                <v-combobox 
                    clearable 
                    v-model="localFlight.aircraftReg" 
                    label="Aircraft Reg" 
                    required 
                    @update:model-value="handleAircraftRegUpdate"
                    :items="aircraftRegs"
                ></v-combobox>
            </v-col>
            <v-col cols="12" sm="5">
                <!-- Aircraft Type -->
                <v-text-field v-model="localFlight.aircraftType" label="Aircraft Type" required></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
                <!-- Departure Time -->
                <v-text-field v-model="localFlight.departureTime" label="Departure Time" format="24hr" required
                    type="datetime-local" @update:model-value="updateDate($event, 'departure')" @blur="assignTemporaryDepartureTime()"></v-text-field>
                </v-col>
                
            <v-col cols="12" sm="6">
                <!-- Arrival Time -->
                <v-text-field v-model="localFlight.arrivalTime" label="Arrival Time" format="24hr" required
                    type="datetime-local" @update:model-value="updateDate($event, 'arrival')"></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="3">
                <!-- Multi Pilot Time -->
                <v-checkbox v-model="localFlight.multiPilotTime" label="Multi Pilot Time" true-value="true"
                    false-value="false"></v-checkbox>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Single Engine Time -->
                <v-text-field v-model="localFlight.singleEngineTime" label="Single Engine Time" format="24hr" @update:focused="setEngineTime('singleEngineTime')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Multi Engine Time -->
                <v-text-field v-model="localFlight.multiEngineTime" label="Multi Engine Time" format="24hr"  @update:focused="setEngineTime('multiEngineTime')"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
                <!-- Total Time -->
                <v-text-field v-model="localFlight.totalTime" label="Total Time" format="24hr"></v-text-field>
            </v-col>
        </v-row>

        <v-row>

            <v-col cols="12" sm="3">
                <!-- Take Offs (Day) -->
                <v-text-field v-model="localFlight.takeOffsDay" label="T-Offs / Day" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="localFlight.takeOffsDay++" @click:prependInner="localFlight.takeOffsDay--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Landings (Day) -->
                <v-text-field v-model="localFlight.landingDay" label="Lndgs / Day" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="localFlight.landingDay++" @click:prependInner="localFlight.landingDay--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Take Offs (Night) -->
                <v-text-field v-model="localFlight.takeOffsNight" label="T-Offs / Night" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="localFlight.takeOffsNight++" @click:prependInner="localFlight.takeOffsNight--">
                </v-text-field>
            </v-col>

            <v-col cols="12" sm="3">
                <!-- Landings (Night) -->
                <v-text-field v-model="localFlight.landingNight" label="Lndgs / Night" type="number" append-inner-icon="mdi-plus" prepend-inner-icon="mdi-minus" @click:appendInner="localFlight.landingNight++" @click:prependInner="localFlight.landingNight--">
                </v-text-field>
            </v-col>
        </v-row>

        <v-card-actions>OPS Time</v-card-actions>

        <v-row>
            <v-col cols="6" sm="4" md="2">
                <!-- Night Time -->
                <v-text-field v-model="localFlight.nightTime" label="Night Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- IFR Time -->
                <v-text-field v-model="localFlight.ifrTime" label="IFR Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- PIC Time -->
                <v-text-field v-model="localFlight.pic" label="PIC Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- SIC Time -->
                <v-text-field v-model="localFlight.sic" label="SIC Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- Dual Time -->
                <v-text-field v-model="localFlight.dual" label="Dual Time" format="24hr"></v-text-field>
            </v-col>
            <v-col cols="6" sm="4" md="2">
                <!-- Instructor Time -->
                <v-text-field v-model="localFlight.instructor" label="FI Time" format="24hr"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6">
                <!-- Remarks -->
                <v-textarea v-model="localFlight.remarks" label="Remarks"></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
                <FlightMap v-if="showMap" :flight="localFlight"></FlightMap>
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
    props: {
        flight: {
            type: Object as PropType<Flight>,
            required: true
        }
    },
    data() {
        return {
            departureAirportData: null,
            arrivalAirportData: null,
            temporaryDepartureDateTime: null,
            dialog: false,
            localFlight: {} as Flight
        }
    },
    created() {
        this.localFlight = { ...this.flight }
    },
    watch: {
        flight: {
            immediate: true,
            handler(newVal) {
                this.localFlight = { ...newVal }
            }
        }
    },
    computed: {
        ...mapState(useLogbookStore, {
            flights: 'flights',
            aircraftRegs: 'aircraftRegs',
            aircraftTypes: 'aircraftTypes',
            getAirportByIcaoCode: 'getAirportByIcaoCode'
        }),
        showMap() {
            return this.localFlight.departure?.length > 3 
                && this.localFlight.arrival?.length > 3
                && this.localFlight.arrival !== this.localFlight.departure
        }
    },
    methods: {
        ...mapActions(useLogbookStore, ['pushFlight']),
        async submitForm() {
            await this.pushFlight(this.localFlight)
            this.$router.push({ path: `/logbook/${this.localFlight.id}`});
        },
        updateTotalTime() {
            const { arrivalTime, departureTime } = this.localFlight;
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

                this.localFlight.totalTime = formattedTime
            }
        },
        updateNightTime() {
            const { departureTime, arrivalTime } = this.localFlight;
            if(departureTime && arrivalTime && this.departureAirportData && this.arrivalAirportData) {
                const departureDate = new Date(departureTime);
                const arrivalDate = new Date(arrivalTime);
                const nightTime = getNightFlightTime(this.localFlight, this.departureAirportData, this.arrivalAirportData)
                this.localFlight.nightTime = nightTime !== '00:00' ? nightTime : null
            }
        },
        setEngineTime(engine: string) {
            if(engine === 'singleEngineTime') {
                this.localFlight.multiEngineTime = null
                this.localFlight.singleEngineTime = this.localFlight.totalTime
            } else if(engine === 'multiEngineTime') {
                this.localFlight.multiEngineTime = this.localFlight.totalTime
                this.localFlight.singleEngineTime = null
            }
        },
        async getAirportData(type: string) {
            const airport = type === 'departure' ? this.localFlight.departure : this.localFlight.arrival
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
                this.localFlight.date = val.split('T')[0]
                !this.localFlight.arrivalTime ? this.temporaryDepartureDateTime = val : null
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
                this.localFlight.aircraftType = aircraftType;
            }
        },
        assignTemporaryDepartureTime() {
            if(this.temporaryDepartureDateTime && !this.localFlight.arrivalTime) {
                this.localFlight.arrivalTime = this.temporaryDepartureDateTime
                this.temporaryDepartureDateTime = null
            }
        }
    },
    components: { FlightMap }
};
</script>