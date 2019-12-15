<template>
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h6 class="mb-1">{{ zone.name }}</h6>
      <small v-if="!isDisabled">
        <b>
          {{ zone.temperature }}
          <I18nText id="unit" />
        </b>
        ({{ Math.floor(zone.min) }}&hellip;{{ Math.ceil(zone.max) }})
      </small>
    </div>
    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <label
        class="btn btn-secondary"
        v-bind:class="{active: isMonitored}"
        @click="addMonitored(zone)"
      >
        <I18nText id="toggles.monitored" />
      </label>
      <label class="btn btn-secondary" v-bind:class="{active: isEnabled}" @click="addEnabled(zone)">
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
  padding: 0.75rem 0.75rem;
}
</style>
