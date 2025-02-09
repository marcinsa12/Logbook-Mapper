<template>
    <div class="filters">
        <!-- @vue-skip -->
        <v-row class="mt-2">
            <v-col cols="12" sm="6" v-for="filter in filters"  > 
                <v-select :multiple="!filter.single" chips density="compact" :items="filter.values" :label="filter.name"
                    @update:model-value="updateFilter(filter.key, $event)"></v-select>
            </v-col>
            <v-col cols="6" sm="3">
                <!-- Date From-->
                <v-text-field v-model="dateFrom" @update:model-value="updateFilter('dateFrom', $event)"  @click="prefixedDates = null" variant="outlined" label="Date From" type="date" density="compact" required></v-text-field>
            </v-col>
            <v-col cols="6" sm="3">
                <!-- Date To-->
                <v-text-field v-model="dateTo" @update:model-value="updateFilter('dateTo', $event)" @click="prefixedDates = null" variant="outlined" label="Date To" type="date" density="compact" required></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6" sm="6">
                <v-radio-group inline @change="updateDates()" class="mt-2" v-model="prefixedDates">
                    <v-radio label="30 Days" value="31"></v-radio>
                    <v-radio label="1 Year" value="365"></v-radio>
                    <v-radio label="This Year" :value="thisYearDays"></v-radio>
                </v-radio-group>
            </v-col>
            <v-col cols="6" sm="3">
                <v-checkbox label="PIC only" v-model="picOnly" @update:model-value="updateFilter('picOnly', $event)"></v-checkbox>
            </v-col>
            <v-col cols="6" sm="3">
                <v-checkbox label="Night only" v-model="nightOnly" @update:model-value="updateFilter('nightOnly', $event)"></v-checkbox>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { useLogbookStore } from '@/stores/logbook';
import { mapActions } from 'pinia';

type ComponentInstance = {
  activeFilters: { [key: string]: string };
  filters: Filter[];
  setFlightFilters: (filters: { [key: string]: string }) => void;
  updateFilter: (name: string, value: string) => void;
};

export default {
    data() {
        return {
            activeFilters: {} as { [key: string]: string },
            prefixedDates: null,
            dateFrom: null,
            dateTo: null,
            picOnly: false,
            nightOnly: false,
        }
    },
    computed: {
        thisYearDays: () => {
                const currentDate: Date = new Date();
                const currentYear: number = currentDate.getFullYear();
                const firstDayOfYear: Date = new Date(currentYear, 0, 1);
                const timeDifference: number = currentDate.getTime() - firstDayOfYear.getTime();
                const daysPassedThisYear = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                return daysPassedThisYear + 1
            }
    },
    props: {
        filters: {
            type: Array as () => Filter[],
            default: () => [],
        },
    },
    methods: {
        // @ts-ignore
        ...mapActions(useLogbookStore, ['setFlightFilters']), 
        updateFilter(this: ComponentInstance, name: string, value: string) {
            if (!value || (Array.isArray(value) && !value.length)) {
                delete this.activeFilters[name]
            } else {
                this.activeFilters[name] = value;
            }
            this.setFlightFilters(this.activeFilters)
        },
        updateDates() {
            this.dateFrom = this.getDateXDaysAgo(this.prefixedDates)
            this.dateTo = this.getDateXDaysAgo(0)
            this.updateFilter('dateFrom', this.dateFrom)
            this.updateFilter('dateTo', this.dateTo)
        },
        getDateXDaysAgo(x: number): string {
            const today: Date = new Date();
            const xDaysAgo: Date = new Date(today);
            xDaysAgo.setDate(today.getDate() - x);

            const year: number = xDaysAgo.getFullYear();
            const month: number = xDaysAgo.getMonth() + 1;
            const day: number = xDaysAgo.getDate();

            const formattedDate: string = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return formattedDate;
        }
    },
}
</script>
<style scoped lang="scss">
.v-input {
    width: 100%;
}
</style>