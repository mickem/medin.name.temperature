<template>
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h6 class="mb-1">{{ zone.name }}</h6>
      <small v-if="!isDisabled">
        <b>{{ zone.temperature }}&deg;C</b>
        ({{ Math.floor(zone.min) }}&hellip;{{ Math.ceil(zone.max) }})
      </small>
    </div>
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <label
        class="btn btn-secondary"
        v-bind:class="{active: isMonitored}"
        @click="addMonitored(zone)"
      >Monitored</label>
      <label
        class="btn btn-secondary"
        v-bind:class="{active: isEnabled}"
        @click="addEnabled(zone)"
      >Enabled</label>
      <label
        class="btn btn-secondary"
        v-bind:class="{active: isDisabled}"
        @click="addDisabled(zone)"
      >Disabled</label>
    </div>
  </li>
</template>

<script lang="js">
export default {
  name: 'ZoneTabZone',
  props: {
    zone: Object,
  },
  computed: {
      isDisabled: function () {
          return this.$root.$data.getZonesIgnored().indexOf(this.zone.id) !== -1;
      },
      isEnabled: function () {
          return this.$root.$data.getZonesIgnored().indexOf(this.zone.id) === -1 && this.$root.$data.getZonesNotMonitored().indexOf(this.zone.id) !== -1;
      },
      isMonitored: function () {
          return this.$root.$data.getZonesNotMonitored().indexOf(this.zone.id) === -1;
      },
  },
  methods: {
     addMonitored : async function(device) {
         this.$root.$data.addZoneMonitored(device);
    },
      addEnabled: async function(device) {
         this.$root.$data.addZoneEnabled(device);
    },
      addDisabled: async function(device) {
         this.$root.$data.addZoneDisabled(device);
    },
  },
};
</script>
<style scoped>
.list-group-item {
  padding: .75rem .75rem;
}
</style>
