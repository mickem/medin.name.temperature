<template>
  <div>
    <div class="card" v-if="deviceHints">
      <div class="card-body">
        <h5 class="card-title">Hints: Devices</h5>
        <p
          class="card-text"
        >Devices are various thermometers found in Homey.</p>
        <p
          class="card-text"
        >A <b>enabled</b> device will contribute to the average temperature of the zone it is in.</p>
        <p
          class="card-text"
        >An <b>disabled</b> zone will be ignored by temperature manager.</p>
        <p class="card-text">You can enable these hints in the settings section.</p>
        <p class="btn btn-primary" @click="disableHints()">Got it</p>
      </div>
    </div>
    <ul class="list-group no-gutters">
      <DeviceTabDevice v-for="device in devices" v-bind:key="device.id" v-bind:device="device"></DeviceTabDevice>
    </ul>
  </div>
</template>
<script lang="js">

import DeviceTabDevice from './DeviceTabDevice.vue';

export default {
  name: 'DeviceTab',
  components: {
    DeviceTabDevice
  },
  data () {
    return {
      deviceHints: this.$root.$data.getSettings().deviceHints,
      devices: this.$root.$data.getDevices(),
    }
  },
  methods: {
    disableHints : async function() {
      this.deviceHints = false;
      const settings = this.$root.$data.getSettings();
      settings.deviceHints = false;
      await this.$root.$data.saveSettings(settings);
    }
  }
}
</script>