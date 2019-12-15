<template>
  <div class="container-fluid">
    <div class="loader" v-if="loading"><I18nText id="loading" /></div>
    <ul class="nav nav-tabs" v-if="!loading">
      <li class="nav-item">
        <a href="#" class="nav-link" v-bind:class="{active: tab === 1}" @click="tab = 1"><I18nText id="tabs.zones" /></a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" v-bind:class="{active: tab === 2}" @click="tab = 2"><I18nText id="tabs.devices" /></a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" v-bind:class="{active: tab === 3}" @click="tab = 3"><I18nText id="tabs.settings" /></a>
      </li>
    </ul>
    <ZoneTab v-if="tab === 1" />
    <DeviceTab v-if="tab === 2" />
    <SettingsTab v-if="tab === 3" />
  </div>
</template>
<script lang="js">

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ZoneTab from './components/ZoneTab.vue';
import DeviceTab from './components/DeviceTab.vue';
import SettingsTab from './components/SettingsTab.vue';
import I18nText from './components/I18nText.vue';

export default {
  name: 'app',
  components: {
    ZoneTab,
    DeviceTab,
    SettingsTab,
    I18nText,
  },
  props: ['homey'],
  data () {
    return {
      loading: true,
      tab: 1,
      i18nScope: "settings",
    }
  },
  mounted() {
    this.loading = false;
  }
}
</script>
<style scoped>
.container-fluid {
  padding-right: 0px;
  padding-left: 0px;
}
.nav {
  margin-left: 0;
}
</style>