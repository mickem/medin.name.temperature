<template>
  <div>
    <Hints scope="settings.settings.hints" settingsKey="settingsHints" count="3" />
    <SettingsTabEntry i18nScope="settings.settings" id="minTemperature" :value="minTemperature" @input="(v) => {minTemperature = v}" />
    <SettingsTabEntry i18nScope="settings.settings" id="maxTemperature" :value="maxTemperature" @input="(v) => {maxTemperature = v}" />
    <SettingsTabEntry i18nScope="settings.settings" id="dailyReset" :value="dailyReset" @input="(v) => {dailyReset = v}" />

      <div class="form-group">
        <label for="showHints">Show all hint dialogs in the settings app</label>
        <button id="showHints" class="btn btn-info" @click="showHints()">Show all hints</button>
      </div>
      <SettingsTabButton id="refresh" @click="refresh()" />
      <div class="form-group">
        <label for="refresh">Refresh the settings view</label>
        <button id="refresh" class="btn btn-info" @click="refresh()">Refresh</button>
      </div>

      <div class="form-group">
        <label for="resetAll">Reset all configuration and restoe defaults</label>
        <button id="resetAll" class="btn btn-danger" @click="reset()">Reset defaults</button>
      </div>
  </div>
</template>

<script lang="js">
import SettingsTabEntry from './SettingsTabEntry.vue';
import SettingsTabButton from './SettingsTabButton.vue';

export default {
  name: 'SettingsTab',
  components: {
    SettingsTabEntry,
    SettingsTabButton,
  },
  data () {
    return {
      settingsHints: this.$root.$data.getSettings().settingsHints,
    }
  },
  computed: {
    minTemperature: {
      get: function () {
        return this.$root.$data.getSettings().minTemperature;
      },
      set: async function (newValue) {
        await this.$root.$data.saveSettings({ minTemperature: newValue });
      }
    },
    maxTemperature: {
      get: function () {
        return this.$root.$data.getSettings().maxTemperature;
      },
      set: async function (newValue) {
        await this.$root.$data.saveSettings({ maxTemperature: newValue });
      }
    },
    dailyReset: {
      get: function() {
        return this.$root.$data.getDailyReset();
      },
      set: async function() {
        const value = this.$root.$data.setDailyReset(this.dailyReset);
        await this.$root.$data.saveSettings({ dailyReset: value });
      }
    }
  },
  methods: {
    disableHints: async function() {
      this.settingsHints = false;
      await this.$root.$data.saveSettings({ settingsHints: false });
    },
    reset: async function() {
      await this.$root.$data.resetSettings();
      this.settings = this.$root.$data.getSettings();
    },
    refresh: async function() {
      await this.$root.$data.reload();
    },
    showHints: async function() {
      this.settingsHints = true;
      await this.$root.$data.saveSettings({ zoneHints: true, deviceHints: true, settingsHints: true });
    }
  }
};
</script>
<style scoped>
</style>
