<template>
  <li class="list-group-item list-group-item-action">
    <div class="row no-gutters">
      <div class="col-6">
        <h6 class="mb-1" @click="onClickDevice()"><img :src="icon" class="icon" />{{ zone.name }}</h6>
      </div>
      <div class="col-6 text-right">
        <small v-if="!isDisabled && zone.temperature.active">
          <b>
            {{ zone.temperature.currentAvg }}<I18nText id="unit" />
          </b>
          (
            <img src="calendar-day-solid.svg" class="tinyIcon" />
          {{ zone.temperature.periodAvg }}
          )
        </small>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-6">
        <a @click="onClickConf()"><i>Configure</i></a>, <a @click="onClickDevice()"><i>Details</i></a>
      </div>
      <div class="col-6 text-right">
        <small v-if="!isDisabled && zone.humidity.active">
          <b>
            {{ zone.humidity.currentAvg }}%
          </b>
          (
            <img src="calendar-day-solid.svg" class="tinyIcon" />
          {{ zone.humidity.periodAvg }}
          )
        </small>
      </div>
    </div>
    <div class="row no-gutters" v-if="showConf">
      Zone mode:
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <label
          class="btn btn-secondary"
          v-bind:class="{active: isMonitored}"
          @click="addMonitored(zone)"
        >
          <I18nText id="toggles.monitored" />
        </label>
        <label
          class="btn btn-secondary"
          v-bind:class="{active: isEnabled}"
          @click="addEnabled(zone)"
        >
          <I18nText id="toggles.enabled" />
        </label>
        <label
          class="btn btn-secondary"
          v-bind:class="{active: isDisabled}"
          @click="addDisabled(zone)"
        >
          <I18nText id="toggles.disabled" />
        </label>
      </div>
    </div>
    <div v-if="showDevice">

      <div class="row no-gutters" v-if="zone.temperature.active">
        <div class="col-9">
          Current minimum temp.
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.floor(zone.temperature.currentMin) }}&deg;C</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.temperature.active">
        <div class="col-9">
          Current maximum temp.
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.ceil(zone.temperature.currentMax) }}&deg;C</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.temperature.active">
        <div class="col-9">
          Daily minimum temp.
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.floor(zone.temperature.periodMin) }}&deg;C</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.temperature.active">
        <div class="col-9">
          Daily maximum temp.
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.ceil(zone.temperature.periodMax) }}&deg;C</small>
        </div>
      </div>

      <div class="row no-gutters" v-if="zone.humidity.active">
        <div class="col-9">
          Current minimum humidity
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.floor(zone.humidity.currentMin) }}%</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.humidity.active">
        <div class="col-9">
          Current maximum humidity
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.ceil(zone.humidity.currentMax) }}%</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.humidity.active">
        <div class="col-9">
          Daily minimum humidity
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.floor(zone.humidity.periodMin) }}%</small>
        </div>
      </div>
      <div class="row no-gutters" v-if="zone.humidity.active">
        <div class="col-9">
          Daily maximum humidity
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ Math.ceil(zone.humidity.periodMax) }}%</small>
        </div>
      </div>

      <div class="row no-gutters" v-for="device in devices" v-bind:key="device.id">
        <div class="col-2">
          <img :src="device.icon" class="icon" style="padding-left 5px;"/>
        </div>
        <div class="col-7">
          {{ device.name }}
        </div>
        <div class="col-3 text-right" style="maring-right: 5px;">
          <small>{{ device.temperature }}&deg;C</small>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="js">
import I18nText from './I18nText.vue';

export default {
  name: 'ZoneTabZone',
  components: {
    I18nText,
  },
  props: {
    zone: Object,
  },
  data() {
    return {
      i18nScope: "settings.zones",
      showConf: false,
      showDevice: false,
    }
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
      icon: function() {
        if (this.zone.icon === 'unknown') {
          return `default.svg`
        }
        return `${this.zone.icon}.svg`
      },
      devices: function() {
        return this.$root.$data.getDevices().filter(d => d.zone === this.zone.id);

      }
  },
  methods: {
    onClickConf: function() {
      this.showConf=!this.showConf;
      this.showDevice = false;
    },
    onClickDevice: function() {
      this.showDevice=!this.showDevice;
      this.showConf = false;
    },
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
  padding: 0.75rem 0.75rem;
}
.icon {
  width: auto;
  height: auto;
  max-width: 20px;
  max-height: 20px;
}
.tinyIcon {
  width: auto;
  height: auto;
  max-width: 10px;
  max-height: 10px;
}
</style>
