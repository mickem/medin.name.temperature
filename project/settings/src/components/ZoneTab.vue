<template>
  <div>
    <div class="card" v-if="zoneHints">
      <div class="card-body">
        <h5 class="card-title">Hints: Zones</h5>
        <p
          class="card-text"
        >Zones are the same as zones in homey and the temperature will be the averge of all <b>enabled</b> thermometers in the zone.</p>
        <p
          class="card-text"
        >A <b>monitored</b> zone will emit alerts whenever the temperature goes out of bounds.</p>
        <p
          class="card-text"
        >An <b>enabled</b> zone will not emit any alerts but all other action cards for temperature change, maxmimum and minimum will still work.</p>
        <p class="card-text">A <b>disabled</b> zone will be ignored by the application.</p>
        <p class="card-text">The values shown for each zone is the average temperature, the minimum temperature today and the maximum temperature today.</p>
        <p class="card-text">You can enable these hints in the settings section.</p>
        <p class="btn btn-primary" @click="disableHints()">Got it</p>
      </div>
    </div>
    <ul class="list-group no-gutters">
      <ZoneTabZone v-for="zone in zones" v-bind:key="zone.id" v-bind:zone="zone"></ZoneTabZone>
    </ul>
  </div>
</template>
<script lang="js">

import ZoneTabZone from './ZoneTabZone.vue';

export default {
  name: 'ZoneTab',
  components: {
    ZoneTabZone
  },
  data () {
    return {
      zones: this.$root.$data.getZones(),
      zoneHints: this.$root.$data.getSettings().zoneHints,
    }
  },
  methods: {
    disableHints : async function() {
      this.zoneHints = false;
      await this.$root.$data.saveSettings({ zoneHints: false });
    }
  }
}
</script>
