<template>
    <div class="filters">
        <v-select
            v-for="filter in filters"
            :items="filter.values"
            :label="filter.name"
            multiple
            chips
            @update:model-value="updateFilter(filter.key, $event)"
        ></v-select>
    </div>
</template>

<script lang="ts">
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
            updateFilter(name, value) {
                if(!value.length) {
                    delete this.activeFilters[name]
                } else {
                    this.activeFilters[name] = value;
                }
                this.$emit('update:activeFilters', this.activeFilters)
            }
        }
    }
</script>
<style scoped lang="scss">
    .v-input {
        width: 100%;
    }

</style>