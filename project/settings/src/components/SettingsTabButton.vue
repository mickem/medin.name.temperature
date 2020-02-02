<template>
  <div class="form-group">
    <label :for="id"><I18nText :id="labelId" /></label>
    <button :id="id" class="btn" :class="extraClass"  @click="$emit('click', $event.target.value)"><I18nText :id="btnId" /></button>
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
    extraClass: {
      type: String,
      default: 'btn-info'
    },
    i18nScope: String,
  },
  data() {
    return {
      labelId: `${this.id}.label`,
      btnId: `${this.id}.button`,
    }

  }
};
</script>
