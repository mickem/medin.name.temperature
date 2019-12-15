<template>
  <div>
    <Hints scope="settings.devices.hints" settingsKey="deviceHints" count="4" />
    <ul class="list-group no-gutters">
      <DeviceTabDevice v-for="device in devices" v-bind:key="device.id" v-bind:device="device"></DeviceTabDevice>
    </ul>
  </div>
</template>
<script lang="js">

import DeviceTabDevice from './DeviceTabDevice.vue';
import Hints from './Hints.vue';

export default {
  name: 'DeviceTab',
  components: {
    DeviceTabDevice,
    Hints,
  },
  data () {
    return {
      devices: this.$root.$data.getDevices()
    }
  },
}
</script>