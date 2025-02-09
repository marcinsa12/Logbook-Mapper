<template>
    <div id="map"></div>
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
    props: {
        flights: {
            type: Array,
            default: () => [],
            required: true
        },
        flight: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            mapEntity: null as Map | null,
            isMapReady: false
        }
    },
    methods: {
        async drawFlightMap() {
            if (!this.mapEntity || !this.isMapReady) {
                console.warn('Map not ready');
                return;
            }
            
            console.log('Drawing flights:', this.flights.length);
            
            try {
                // Clear existing flight paths
                const layers = this.mapEntity.getLayers().getArray();
                while (layers.length > 1) {
                    this.mapEntity.removeLayer(layers[layers.length - 1]);
                }

                // Draw new flight paths
                const ftd = this.flight ? this.flights.concat(this.flight) : this.flights;
                for (const flight of ftd) {
                    const { departure, arrival } = flight;
                    if (departure && arrival && departure !== arrival) {
                        const from = await this.getAirportByIcaoCode(departure);
                        const to = await this.getAirportByIcaoCode(arrival);
                        if (from && to) {
                            await this.addFlightPath(from, to);
                        }
                    }
                }
            } catch (error) {
                console.error('Error drawing flight paths:', error);
            }
        },
        async addFlightPath(from: any, to: any) {
            if (!this.mapEntity || !this.isMapReady) return;
            
            try {
                await drawLineWithArrow(from, to, this.mapEntity);
            } catch (error) {
                console.error('Error adding flight path:', error);
            }
        },
        resetMap() {
            this.isMapReady = false;
            if (this.mapEntity) {
                try {
                    const layers = this.mapEntity.getLayers().getArray();
                    while (layers.length > 0) {
                        this.mapEntity.removeLayer(layers[layers.length - 1]);
                    }
                    this.mapEntity.setTarget(undefined);
                } catch (error) {
                    console.error('Error cleaning up map:', error);
                }
                this.mapEntity = null;
            }
            this.$nextTick(() => {
                this.initMap();
            });
        },
        initMap() {
            try {
                this.mapEntity = new Map({
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

                this.mapEntity.once('postrender', () => {
                    this.isMapReady = true;
                    this.$emit('update:mapEntity', this.mapEntity);
                    this.drawFlightMap();
                });
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }
    },
    computed: {
        // @ts-ignore
        ...mapState(useLogbookStore, {
            getAirportByIcaoCode: (state: LogbookGetters) => state.getAirportByIcaoCode
        }),
    },
    mounted() {
        this.initMap();
    },
    beforeUnmount() {
        this.isMapReady = false;
        if (this.mapEntity) {
            this.mapEntity.setTarget(undefined);
            this.mapEntity = null;
        }
    }
}
</script>

<style>
#map {
    width: 100%;
    height: 60vh;
}
</style>