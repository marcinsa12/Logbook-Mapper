<template>
    <div class="filters">
        <v-select v-for="filter in filters" :items="filter.values" :label="filter.name" multiple chips
            @update:model-value="updateFilter(filter.key, $event)"></v-select>
    </div>
</template>

<script lang="ts">
import { useLogbookStore } from '@/stores/logbook';
import { mapActions } from 'pinia';

export default {
    data() {
        return {
            activeFilters: {}
        }
    },
    props: {
        filters: Array
    },
    methods: {
        ...mapActions(useLogbookStore, ["setFlightFilters"]),
        updateFilter(name, value) {
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