<script lang="ts">
import { useLogbookStore } from '@/stores/logbook';
import { mapState } from 'pinia';
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(useLogbookStore, ["flightsNo", "landings", "googleAuthUser"])
  }
}
</script>

<template>
  <div v-if="googleAuthUser && landings">
    <h3 class="green">Some stats about your Flying Experience</h3>
    <p>
      You've completed a Total of: {{ flightsNo }} flights
    </p>
    <div v-if="landings">
      <p>
        You've made a succesfull {{ landings.total }} landings. Of which {{ landings.night }} at night
      </p>
    </div>
  </div>
</template>
