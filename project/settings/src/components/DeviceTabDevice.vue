<template>
  <li class="list-group-item list-group-item-action">
    <div class="row no-gutters">
      <div class="col-3">
        <div>
          <img :src="device.icon" v-if="hasIcon" class="icon"/>
        </div>
        <span class="battery" :class="batteryClass">{{ batteryLevel }}</span>
      </div>
      <div class="col-9">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">{{ device.name }}</h6>
          <small v-if="!isDisabled">
            <b>{{ temperature }}&deg;C</b>
          </small>
        </div>
        <div>
          {{ device.zoneName }}
        </div>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            class="btn btn-secondary"
            v-bind:class="{active: !isDisabled}"
            @click="setEnabled(device)"
          >Enabled</label>
          <label
            class="btn btn-secondary"
            v-bind:class="{active: isDisabled}"
            @click="setDisabled(device)"
          >Disabled</label>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="js">
export default {
  name: 'DeviceTabDevice',
  props: {
    device: Object,
  },
  computed: {
      isDisabled: function () {
          return this.$root.$data.getDevicesIgnored().indexOf(this.device.id) !== -1;
      },
      batteryLevel: function() {
        return ("number" === typeof this.device.battery) ? this.device.battery : "-";
      },
      batteryClass: function() {
        if ("number" !== typeof this.device.battery) {
          return "charge-100"
        }
        const s = this.device.battery / 100;
        return s < .1 ? "charge-0" : s < .3 ? "charge-20" : s < .5 ? "charge-40" : s < .7 ? "charge-60" : s < .9 ? "charge-80" : "charge-100";
      },
      hasIcon: function() {
        return this.device.icon;
      },
      temperature: function() {
        return Math.round(this.device.temperature*10)/10;
      }
  },
  methods: {
    setDisabled: async function(device) {
      this.$root.$data.addDeviceIgnored(device);
    },
    setEnabled: async function(device) {
        this.$root.$data.removeDeviceIgnored(device);
    },
  },
};
</script>
<style scoped>
.list-group-item {
  padding: 0.75rem 0.75rem;
}

.battery {
  position: absolute;
  z-index: 1;
  width: 23.1px;
  height: 13.2px;
  line-height: 13.2px;
  font-size: 7px;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 14px;
  margin-left: 3px;
  transform: scale(1.5);
}

.battery,
.battery:after {
  border: 1px solid white;
  box-shadow: inset 0 -4vw 4vw rgba(0, 0, 0, 0.1);
  border-radius: 2.5px;
  box-sizing: border-box;
  transition: all 0.3s;
}

.battery:after {
  content: '';
  display: block;
  position: absolute;
  z-index: 2;
  top: 2px;
  bottom: 2px;
  left: 100%;
  width: 3px;
  border-radius: 2.5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
}

.battery.charge-100,
.battery.charge-100:after {
  background: #00c900;
}

.battery.charge-80,
.battery.charge-80:after {
  background: #51c900;
}

.battery.charge-60,
.battery.charge-60:after {
  background: #a1c900;
}

.battery.charge-40,
.battery.charge-40:after {
  background: #c9a100;
}

.battery.charge-20,
.battery.charge-20:after {
  background: #c95100;
}

.battery.charge-0,
.battery.charge-0:after {
  background: #ca0000;
}
.icon {
    width:auto;
    height:auto;
    max-width:30px;
    max-height:30px;
}

</style>
