<template>
  <div>
    <Hints scope="settings.zones.hints" settingsKey="zoneHints" count="6" />
    <ul class="list-group no-gutters">
      <ZoneTabZone v-for="zone in zones" v-bind:key="zone.id" v-bind:zone="zone"></ZoneTabZone>
    </ul>
  </div>
</template>
<script lang="js">

import ZoneTabZone from './ZoneTabZone.vue';
import Hints from './Hints.vue';

export default {
  name: 'ZoneTab',
  components: {
    ZoneTabZone,
    Hints,
  },
  data () {
    return {
      zones: this.$root.$data.getZones(),
    }
  }
}
</script>
