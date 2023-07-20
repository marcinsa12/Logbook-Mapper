<template>
    <div class="filters">
        <!-- @vue-skip -->
        <v-select v-for="filter in filters" :items="filter.values" :label="filter.name" multiple chips
            @update:model-value="updateFilter(filter.key, $event)"></v-select>
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
            if (!value.length) {
                delete this.activeFilters[name]
            } else {
                this.activeFilters[name] = value;
            }
            this.setFlightFilters(this.activeFilters)
        }
    }
}
</script>
<style scoped lang="scss">
.v-input {
    width: 100%;
}
</style>