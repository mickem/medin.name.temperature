<template>
  <div>
    <div class="card" v-if="settingsHints">
      <div class="card-body">
        <h5 class="card-title">Hints: Settings</h5>
        <p
          class="card-text"
        >Minimum and maximum temperature will be used by the tooWarm and TooCold cards to trigger your flows.</p>
        <p class="card-text">You can enable these hints in the settings section.</p>
        <p class="btn btn-primary" @click="disableHints()">Got it</p>
      </div>
    </div>
    <div class="form">
      <div class="form-group">
        <label for="minTemp">Minimum Temperature</label>
        <input type="text" class="form-control" id="minTemp" v-model="minTemperature" />
      </div>
      <div class="form-group">
        <label for="minTemp">Maximum Temperature</label>
        <input type="text" class="form-control" id="minTemp" v-model="maxTemperature" />
      </div>
      <div class="form-group">
        <label for="dailyReset">Time to reset daily averages</label>
        <input type="text" @blur="updateDailyReset()" class="form-control" id="dailyReset" v-model="dailyReset" />
      </div>

      <div class="form-group">
        <label for="showHints">Show all hint dialogs in the settings app</label>
        <button id="showHints" class="btn btn-info" @click="showHints()">Show all hints</button>
      </div>

      <div class="form-group">
        <label for="resetAll">Reset all configuration and restoe defaults</label>
        <button id="resetAll" class="btn btn-danger" @click="reset()">Reset defaults</button>
      </div>
    </div>
  </div>
</template>

<script lang="js">
export default {
  name: 'SettingsTab',
  data () {
    return {
      dailyReset: this.$root.$data.getDailyReset(),
    }
  },
  computed: {
    settingsHints: function() {
      return this.$root.$data.getSettings().settingsHints;
    },
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
  },
  methods: {
    updateDailyReset: async function() {
      const value = this.$root.$data.setDailyReset(this.dailyReset);
      await this.$root.$data.saveSettings({ dailyReset: value });
    },
    disableHints: async function() {
      await this.$root.$data.saveSettings({ settingsHints: false });
    },
    reset: async function() {
      await this.$root.$data.resetSettings();
      this.settings = this.$root.$data.getSettings();
    },
    showHints: async function() {
      await this.$root.$data.saveSettings({ zoneHints: true, deviceHints: true, settingsHints: true });
    }
  }
};
</script>
<style scoped>
</style>
