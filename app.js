!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("homey"),require("athom-api")):"function"==typeof define&&define.amd?define(["homey","athom-api"],t):"object"==typeof exports?exports.library=t(require("homey"),require("athom-api")):e.library=t(e.homey,e["athom-api"])}(global,(function(e,t){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=1)}([function(t,i){t.exports=e},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};const s=i(2),r=o(i(0)),a=i(3),d=i(4),c=i(5),h=i(6),u=i(7),l="dailyreset";class g extends r.default.App{constructor(e){super(e),this.api=void 0,this.triggers=new h.Triggers,this.zones=new u.Zones(this),this.actions=new a.Actions({setMaxTemperature(e){},setMinTemperature(e){}}),this.settingsManager=new c.SettingsManager({onAppState:e=>{e.zones&&this.zones.setState(e.zones)},onDeviceConfigUpdated:e=>n(this,void 0,void 0,(function*(){console.log("Device configuration updated: ",e),yield this.zones.updateDevices(e.zonesIgnored||[],e.zonesNotMonitored||[],e.devicesIgnored||[])})),onSettingsUpdated:(e,t)=>n(this,void 0,void 0,(function*(){console.log("Settings updated: ",e),this.zones.onUpdateSettings(e),e.dailyReset!==t.dailyReset&&(console.log("Settings changed"),yield this.installTasks())}))})}onInit(){return n(this,void 0,void 0,(function*(){try{this.api=yield s.HomeyAPI.forCurrentHomey(),this.deviceManager=new d.DeviceManager(this.api,this.zones),yield this.settingsManager.start(),console.log("onInit"),yield this.installTasks(),this.triggers.register(),this.actions.register(),this.triggers.disable(),yield this.deviceManager.start(),this.triggers.enable(),console.log("Application loaded")}catch(e){console.error(`Failed to handle onInit: ${e}`)}}))}getTriggers(){return this.triggers}getZones(){return this.zones.getAll()}getDevices(){return n(this,void 0,void 0,(function*(){return this.api.devices.getDevices()}))}onZoneUpdated(){this.settingsManager.setState({zones:this.zones.getState()})}installTasks(){return n(this,void 0,void 0,(function*(){try{console.log("installing scheduled tasks");try{const e=yield r.default.ManagerCron.getTasks(l);for(const t of e)console.log(`Uninstalling task: ${t.id}`),yield r.default.ManagerCron.unregisterTask(t.id)}catch(e){console.log("Failed to remove existing job",e)}if("never"!==this.settingsManager.getSettings().dailyReset){const e=this.getDailyRestCron();console.log(`Updated time to: ${e}`),this.task=yield r.default.ManagerCron.registerTask(l,e),this.task.on("run",()=>{console.log("Reseting all zones max/min temperatures: "+new Date),this.zones.resetMaxMin()})}else console.log("Reseting of max/min temperatures is disabled")}catch(e){console.log("Failed to reset task",e)}}))}getDailyRestCron(){const e=this.settingsManager.getSettings().dailyReset.split(":"),t=e.length>0?e[0]:"2";return`0 ${e.length>1?e[1]:"00"} ${t} * * *`}}e.exports=g},function(e,i){e.exports=t},function(e,t,i){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=n(i(0));t.Actions=class{constructor(e){this.handler=e,this.SetMaxTemperature=new o.default.FlowCardAction("SetMaxTemperature"),this.SetMinTemperature=new o.default.FlowCardAction("SetMinTemperature")}register(){console.log("Registering actions"),this.SetMaxTemperature.register().on("run",(e,t,i)=>{console.log("TemperatureManager:setMaxTemp"+e),this.handler.setMaxTemperature(0),i(null,!0)}),this.SetMinTemperature.register().on("run",(e,t,i)=>{console.log("TemperatureManager:SetMinTemperature"+e),this.handler.setMinTemperature(0),i(null,!0)})}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const o=e=>new Promise(t=>setTimeout(t,e)),s=e=>"measure_temperature"in e.capabilitiesObj;t.DeviceManager=class{constructor(e,t){this.api=e,this.zones=t}start(){return n(this,void 0,void 0,(function*(){console.log("Starting device manager"),this.setupDeviceSubscription(),this.setupZoneSubscriptions(),yield Promise.all([this.scanZones(),yield this.scanDevices()])}))}setupDeviceSubscription(){this.api.devices.on("device.create",e=>n(this,void 0,void 0,(function*(){return yield this.onDeviceCreate(e)}))),this.api.devices.on("device.update",e=>n(this,void 0,void 0,(function*(){return yield this.onDeviceUpdate(e)}))),this.api.devices.on("device.delete",e=>n(this,void 0,void 0,(function*(){return yield this.onDeviceDelete(e)})))}onDeviceCreate(e){return n(this,void 0,void 0,(function*(){try{if(!s(e))return;const t=yield this.waitForDevice(e,12);t&&(yield this.addDevice(t))}catch(e){console.error(`Failed to handle device.create: ${e}`)}}))}onDeviceUpdate(e){return n(this,void 0,void 0,(function*(){try{if(!s(e))return;const t=this.zones.findDevice(e.id);t&&t.getZoneId()!==e.zone&&(yield this.zones.moveDevice(t,t.getZoneId(),e.zone,e.zoneName)),t.name!==e.name&&t.setName(e.name)}catch(e){console.error(`Failed to handle device.update: ${e}`)}}))}onDeviceDelete(e){return n(this,void 0,void 0,(function*(){try{if(!s(e))return;yield this.zones.removeDeviceById(e.id)}catch(e){console.error(`Failed to handle device.delete: ${e}`)}}))}setupZoneSubscriptions(){this.api.zones.on("zone.create",e=>n(this,void 0,void 0,(function*(){return yield this.onZoneCreate(e)}))),this.api.zones.on("zone.update",e=>n(this,void 0,void 0,(function*(){return yield this.onZoneUpdate(e)}))),this.api.zones.on("zone.delete",e=>n(this,void 0,void 0,(function*(){return yield this.onZoneDelete(e)})))}onZoneCreate(e){return n(this,void 0,void 0,(function*(){try{this.zones.addZone(e.id,e.name)}catch(e){console.error(`Failed to handle zone.create: ${e}`)}}))}onZoneUpdate(e){return n(this,void 0,void 0,(function*(){try{if(!e)return void console.log("Why is the zone empty: ",e);const t=this.zones.getZoneById(e.id);t&&t.getName()!==e.name&&t.setName(e.name)}catch(t){console.error("Failed to handle zone.update: ",t,e)}}))}onZoneDelete(e){return n(this,void 0,void 0,(function*(){try{this.zones.removeZone(e.id)}catch(e){console.error(`Failed to handle zone.delete: ${e}`)}}))}scanZones(){return n(this,void 0,void 0,(function*(){const e=yield this.api.zones.getZones();for(const t in e)this.zones.addZone(t,e[t].name)}))}scanDevices(){return n(this,void 0,void 0,(function*(){const e=yield this.api.devices.getDevices();for(const t in e){if(!s(e[t])){e[t].ready||console.log("Skipping: ",e[t]);continue}const i=yield this.waitForDevice(e[t],12);i&&(yield this.addDevice(i))}}))}waitForDevice(e,t){return n(this,void 0,void 0,(function*(){const i=yield this.api.devices.getDevice({id:e.id});return i.ready?i:(yield o(1e3),t>0?yield this.waitForDevice(e,t--):(console.log("Found Device, not ready:    "+i.name),this.devicesNotReadyAtStart.push(i.name),!1))}))}addDevice(e){return n(this,void 0,void 0,(function*(){const t=this.zones.addZone(e.zone,e.zoneName);yield t.addDevice(e),e.makeCapabilityInstance("measure_temperature",i=>n(this,void 0,void 0,(function*(){yield t.updateTemp(e.id,i)})))}))}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=o(i(0));t.defaultSettings={dailyReset:"02:00",maxTemperature:22,minTemperature:18};const r={devicesIgnored:[],zonesIgnored:[],zonesNotMonitored:[]};t.SettingsManager=class{constructor(e){this.listener=e,this.settings=Object.assign({},t.defaultSettings),this.deviceConfig=Object.assign({},r)}start(){return n(this,void 0,void 0,(function*(){this.settings=Object.assign(Object.assign({},t.defaultSettings),s.default.ManagerSettings.get("settings")||t.defaultSettings),yield this.listener.onSettingsUpdated(this.settings,t.defaultSettings),this.deviceConfig.zonesIgnored=s.default.ManagerSettings.get("zonesIgnored")||[],this.deviceConfig.zonesNotMonitored=s.default.ManagerSettings.get("zonesNotMonitored")||[],this.deviceConfig.devicesIgnored=s.default.ManagerSettings.get("devicesIgnored")||[],yield this.listener.onDeviceConfigUpdated(this.deviceConfig),this.subscribe();const e=s.default.ManagerSettings.get("state");e&&(console.log("Restoring state: "),yield this.listener.onAppState(e))}))}setState(e){s.default.ManagerSettings.set("state",e)}getSettings(){return this.settings}subscribe(){s.default.ManagerSettings.on("set",e=>n(this,void 0,void 0,(function*(){try{if("settings"===e){const e=s.default.ManagerSettings.get("settings");console.log(`Allowed temperature span: ${e.minTemperature} - ${e.maxTemperature}`),console.log(`Reset max/min running at: ${e.dailyReset}`);const t=this.settings;this.settings=Object.assign({},e),yield this.listener.onSettingsUpdated(this.settings,t)}else"zonesIgnored"===e?(this.deviceConfig.zonesIgnored=s.default.ManagerSettings.get("zonesIgnored")||[],yield this.listener.onDeviceConfigUpdated(this.deviceConfig)):"zonesNotMonitored"===e?(this.deviceConfig.zonesNotMonitored=s.default.ManagerSettings.get("zonesNotMonitored")||[],yield this.listener.onDeviceConfigUpdated(this.deviceConfig)):"devicesIgnored"===e&&(this.deviceConfig.devicesIgnored=s.default.ManagerSettings.get("devicesIgnored")||[],yield this.listener.onDeviceConfigUpdated(this.deviceConfig))}catch(e){console.error(`Failed to update settings: ${e}`)}})))}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const s=o(i(0));t.Triggers=class{constructor(){this.MaxTemperatureChanged=new s.default.FlowCardTrigger("MaxTemperatureChanged"),this.MinTemperatureChanged=new s.default.FlowCardTrigger("MinTemperatureChanged"),this.TemperatureChanged=new s.default.FlowCardTrigger("TemperatureChanged"),this.TooCold=new s.default.FlowCardTrigger("TooCold"),this.TooWarm=new s.default.FlowCardTrigger("TooWarm"),this.enabled=!0}register(){console.log("Registering triggers"),this.TemperatureChanged.register(),this.MaxTemperatureChanged.register(),this.MinTemperatureChanged.register(),this.TooCold.register(),this.TooWarm.register()}enable(){console.log("Enabling all triggers"),this.enabled=!0}disable(){console.log("Disabling all triggers"),this.enabled=!1}onTempUpdated(e,t){return n(this,void 0,void 0,(function*(){this.enabled&&(yield this.TemperatureChanged.trigger({temperature:t,zone:e}))}))}onMaxUpdated(e,t,i){return n(this,void 0,void 0,(function*(){this.enabled&&(yield this.MaxTemperatureChanged.trigger({device:t,temperature:i,zone:e}))}))}onMinUpdated(e,t,i){return n(this,void 0,void 0,(function*(){this.enabled&&(yield this.MinTemperatureChanged.trigger({device:t,temperature:i,zone:e}))}))}onTooWarm(e,t){return n(this,void 0,void 0,(function*(){this.enabled&&(yield this.TooWarm.trigger({temperature:t,zone:e}))}))}onTooCold(e,t){return n(this,void 0,void 0,(function*(){this.enabled&&(yield this.TooCold.trigger({temperature:t,zone:e}))}))}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const o=i(8);t.Zones=class{constructor(e){this.manager=e,this.zones={},this.zonesIgnored=[],this.zonesNotMonitored=[],this.devicesIgnored=[]}resetMaxMin(){for(const e in this.zones)this.zones[e].resetMaxMin()}addZone(e,t){if(e in this.zones)return this.zones[e];const i=new o.Zone(this.manager,e,t,this.zonesIgnored.includes(e),this.zonesNotMonitored.includes(e),this.devicesIgnored);return this.settings&&i.onUpdateSettings(this.settings),this.state&&i.getId()in this.state&&(i.setState(this.state[i.getId()]),delete this.state[i.getId()]),this.zones[e]=i,i}getZoneById(e){if(e in this.zones)return this.zones[e]}removeZone(e){this.getZoneById(e)&&delete this.zones[e]}removeDeviceById(e){return n(this,void 0,void 0,(function*(){for(const t in this.zones)yield this.zones[t].removeDevice(e)}))}findDevice(e){for(const t in this.zones){const i=this.zones[t].findDevice(e);if(i)return i}}moveDevice(e,t,i,o){return n(this,void 0,void 0,(function*(){const n=this.addZone(i,o||"unknown"),s=this.addZone(t,"unknown");console.log(`Moving thermometer from ${s.getName()} to ${n.getName()}`),yield n.addThermometer(e),yield s.removeDevice(e.id),e.setZone(n.getId(),n.getName())}))}getAll(){return this.zones}getState(){const e={};for(const t in this.zones)e[t]=this.zones[t].getState();return e}setState(e){this.state=e}onUpdateSettings(e){this.settings=e;for(const t in this.zones)this.zones[t].onUpdateSettings(e)}updateDevices(e,t,i){return n(this,void 0,void 0,(function*(){if(this.zonesIgnored!==e){this.zonesIgnored=e;for(const e in this.zones)yield this.zones[e].setIgnored(this.zonesIgnored.includes(e))}if(this.zonesNotMonitored!==t){this.zonesNotMonitored=t;for(const e in this.zones)yield this.zones[e].setNotMonitored(this.zonesNotMonitored.includes(e))}if(this.devicesIgnored!==i){this.devicesIgnored=i;for(const e in this.zones)yield this.zones[e].setDevicesIgnored(this.devicesIgnored)}}))}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const o=i(9);t.Zone=class{constructor(e,t,i,n,o,s){this.manager=e,this.id=t,this.name=i,this.devices=[],this.minTemp=void 0,this.minSensor=void 0,this.maxTemp=void 0,this.maxSensor=void 0,this.current=void 0,this.ignored=n,this.notMonitored=o,this.devicesIgnored=s}getId(){return this.id}getName(){return this.name}setName(e){this.name=e}getTemperature(){return this.current}getMin(){return this.minTemp}getMax(){return this.maxTemp}hasDevice(){return this.devices.length>0}onUpdateSettings(e){this.minAllowed=e.minTemperature,this.maxAllowed=e.maxTemperature}addDevice(e){return n(this,void 0,void 0,(function*(){return yield this.addThermometer(new o.Thermometer(e,this.devicesIgnored.includes(e.id)))}))}addThermometer(e){return n(this,void 0,void 0,(function*(){return this.devices.push(e),yield this.calculateZoneTemp(),e.hasTemp()&&(yield this.updateTemp(e.id,e.temp)),e}))}removeDevice(e){return n(this,void 0,void 0,(function*(){for(let t=0;t<this.devices.length;t++)if(this.devices[t].id===e)return this.devices.splice(t,1),void(yield this.calculateZoneTemp())}))}setIgnored(e){return n(this,void 0,void 0,(function*(){this.ignored!==e&&(this.ignored=e,yield this.calculateZoneTemp())}))}setNotMonitored(e){this.notMonitored=e}setDevicesIgnored(e){return n(this,void 0,void 0,(function*(){this.devicesIgnored=e;let t=!1;for(const e of this.devices)e.setIgnored(this.devicesIgnored.includes(e.id))&&(t=!0);yield this.calculateZoneTemp()}))}resetMaxMin(){this.minTemp=void 0,this.maxTemp=void 0}updateTemp(e,t){return n(this,void 0,void 0,(function*(){const i=this.findDevice(e);if(i)if(this.ignored)i.update(t);else{if(i.update(t)&&(yield this.calculateZoneTemp()),void 0===this.minTemp)this.onMinUpdated(i.name,t);else{const e=Math.min(this.minTemp,t);this.minTemp!==e&&this.onMinUpdated(i.name,t)}if(void 0===this.maxTemp)this.onMaxUpdated(i.name,t);else{const e=Math.max(this.maxTemp,t);this.maxTemp!==e&&this.onMaxUpdated(i.name,t)}this.manager.onZoneUpdated()}else console.error("Failed to find device: "+e)}))}getState(){return{maxSensor:this.maxSensor,maxTemp:this.maxTemp,minSensor:this.minSensor,minTemp:this.minTemp}}setState(e){this.maxSensor=e.maxSensor,this.maxTemp=e.maxTemp,this.minSensor=e.minSensor,this.minTemp=e.minTemp}findDevice(e){for(const t of this.devices)if(t.id===e)return t}calculateZoneTemp(){return n(this,void 0,void 0,(function*(){if(this.ignored)return void(this.current=void 0);let e=0,t=0;for(const i of this.devices)i.hasTemp()&&(e+=i.temp,t++);if(t>0){const i=Math.round(e/t*10)/10;i!==this.current&&(this.current=i,yield this.onTempUpdated())}else this.current=void 0}))}onMaxUpdated(e,t){this.maxTemp=t,this.maxSensor=e,this.manager.getTriggers().onMaxUpdated(this.name,e,this.maxTemp)}onMinUpdated(e,t){this.minTemp=t,this.minSensor=e,this.manager.getTriggers().onMinUpdated(this.name,e,this.minTemp)}onTempUpdated(){return n(this,void 0,void 0,(function*(){this.notMonitored?yield this.manager.getTriggers().onTempUpdated(this.name,this.current):this.current>this.maxAllowed?this.manager.getTriggers().onTooWarm(this.name,this.current):this.current<this.minAllowed?this.manager.getTriggers().onTooCold(this.name,this.current):yield this.manager.getTriggers().onTempUpdated(this.name,this.current)}))}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.Thermometer=class{constructor(e,t){this.device=e,this.id=e.id,this.name=e.name,this.zoneId=e.zone,this.zone=e.zoneName,this.temp=e.capabilitiesObj&&e.capabilitiesObj.measure_temperature&&e.capabilitiesObj.measure_temperature.value?+e.capabilitiesObj.measure_temperature.value:void 0,this.ignored=t}getName(){return this.name}setName(e){this.name=e}getZone(){return this.zone}getZoneId(){return this.zoneId}setZone(e,t){this.zoneId=e,this.zone=t}update(e){return this.temp!==e&&(this.temp=e,!0)}setIgnored(e){this.ignored;return this.ignored=e,!0}hasTemp(){return!this.ignored&&void 0!==this.temp}}}])}));