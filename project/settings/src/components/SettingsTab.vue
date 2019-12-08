<template>
  <div>
    <div class="card" v-if="settings.settingsHints">
      <div class="card-body">
        <h5 class="card-title">Hints: Settings</h5>
        <p
          class="card-text"
        >Minimum and maximum temperature will be used by the tooWarm and TooCold cards to trigger your flows.</p>
        <p class="card-text">You can enable these hints in the settings section.</p>
        <p class="btn btn-primary" @click="disableHints()">Got it</p>
      </div>
    </div>
    <form>
      <div class="form-group">
        <label for="minTemp">Minimum Temperature</label>
        <input type="text" class="form-control" id="minTemp" v-model="minTemperature" />
      </div>
      <div class="form-group">
        <label for="minTemp">Maximum Temperature</label>
        <input type="text" class="form-control" id="minTemp" v-model="maxTemperature" />
      </div>

      <div class="form-group">
        <label for="showHints">Show all hint dialogs in the settings app</label>
        <button id="showHints" class="btn btn-info" @click="showHints()">Show all hints</button>
      </div>

      <div class="form-group">
        <label for="resetAll">Reset all configuration and restoe defaults</label>
        <button id="resetAll" class="btn btn-danger" @click="reset()">Reset defaults</button>
      </div>
    </form>
  </div>
</template>

<script lang="js">
export default {
  name: 'SettingsTab',
  data () {
    return {
      settings: this.$root.$data.getSettings(),
      minTemperature: this.$root.$data.getSettings().minTemperature,
      maxTemperature: this.$root.$data.getSettings().maxTemperature,
    }
  },
  methods: {
    disableHints : async function() {
      this.settings.settingsHints = false;
      await this.$root.$data.saveSettings(this.settings);
    },
    reset : async function() {
      await this.$root.$data.resetSettings();
      this.settings = this.$root.$data.getSettings();
    },
    showHints : async function() {
      this.settings.zoneHints = true;
      this.settings.deviceHints = true;
      this.settings.settingsHints = true;
      await this.$root.$data.saveSettings(this.settings);
    }
  }
};
</script>
<style scoped>
</style>
