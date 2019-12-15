<template>
  <div class="form-group">
    <label :for="id"><I18nText :id="id" /></label>
    <input type="text" class="form-control" :id="id" v-model="value" @blur="$emit('input', $event.target.value)"/>
  </div>
</template>

<script lang="js">
import I18nText from './I18nText.vue';

export default {
  name: 'SettingsTabEntry',
  components: {
    I18nText,
  },
  props: {
    id: String,
    value: Object,
    i18nScope: String,
  },
};
</script>
