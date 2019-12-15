<template>
  <div class="card" v-if="showHints">
    <div class="card-body">
      <h5 class="card-title">Hints: Devices</h5>
      <p class="card-text" v-for="hint in hints" v-bind:key="hint">
        <I18nText v-bind:id="hint" />
      </p>
      <p class="btn btn-primary" @click="disableHints()">
        <I18nText id="button" />
      </p>
    </div>
  </div>
</template>
<script lang="js">

import I18nText from './I18nText.vue';

export default {
  name: 'Hints',
  props: {
    settingsKey: String,
    scope: String,
    count: Number,
  },
  components: {
    I18nText
  },
  data: function () {
    console.log(this);
    return {
      showHints: this.$root.$data.getSettings()[this.settingsKey],
    }
  },
  computed: {
    i18nScope: function() {
      return this.scope;
    },
    hints: function() {
      const ret = [];
      for (let i=0;i<this.count;i++) {
        ret.push(`hint${i+1}`);
      }
      return ret;
    }
  },
  methods: {
    disableHints : async function() {
      this.showHints = false;
      await this.$root.$data.saveSettings({ [this.settingsKey]: false });
    }
  }
}
</script>