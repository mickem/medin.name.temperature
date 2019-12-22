(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("homey"), require("athom-api"));
	else if(typeof define === 'function' && define.amd)
		define(["homey", "athom-api"], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory(require("homey"), require("athom-api"));
	else
		root["library"] = factory(root["homey"], root["athom-api"]);
})(global, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Catch(swallow = false) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                const result = originalMethod.apply(this, args);
                // check if method is asynchronous
                if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
                    return result.catch((error) => {
                        console.error(`A fault occured in ${propertyKey}: \n|${originalMethod.toString().replace(/\n/g, '\n| ')}`, error);
                        if (!swallow) {
                            throw error;
                        }
                    });
                }
                return result;
            }
            catch (error) {
                if (!swallow) {
                    throw error;
                }
            }
        };
        return descriptor;
    };
}
exports.Catch = Catch;


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const homey_1 = __importDefault(__webpack_require__(0));
const TemperatureManager_1 = __webpack_require__(5);
const mgr = new TemperatureManager_1.TempManager();
class Wrapper extends homey_1.default.App {
    get() {
        return mgr;
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mgr.onInit();
        });
    }
}
module.exports = Wrapper;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const athom_api_1 = __webpack_require__(6);
const ActionManager_1 = __webpack_require__(7);
const DeviceManager_1 = __webpack_require__(8);
const JobManager_1 = __webpack_require__(9);
const SettingsManager_1 = __webpack_require__(10);
const TriggerManager_1 = __webpack_require__(11);
const utils_1 = __webpack_require__(1);
const Zones_1 = __webpack_require__(12);
class TempManager {
    constructor() {
        this.loaded = false;
        console.log(`Starting temperature manager`);
        this.api = undefined;
        this.listeners = {};
        this.triggers = new TriggerManager_1.TriggerManager(['TemperatureChanged', 'TooCold', 'TooWarm', 'MinTemperatureChanged', 'MaxTemperatureChanged']);
        this.zones = new Zones_1.Zones(this.triggers.get(), {
            onZoneUpdated: (id) => {
                if (this.listeners[id] !== undefined) {
                    for (const cb of this.listeners[id]) {
                        cb();
                    }
                }
                this.settingsManager.setState({
                    zones: this.zones.getState(),
                });
            },
        });
        this.actions = new ActionManager_1.ActionManager({
            SetTemperatureBounds: args => {
                if (args.type === 'min') {
                    console.log(`A flow updated the minimum temperature bound to ${args.temperature}`);
                    this.settingsManager.setSettings({ minTemperature: args.temperature });
                }
                else if (args.type === 'max') {
                    console.log(`A flow updated the maximum temperature bound to ${args.temperature}`);
                    this.settingsManager.setSettings({ maxTemperature: args.temperature });
                }
                else {
                    console.error(`Unknown bound ${args.type}`);
                    return false;
                }
                return true;
            },
            SetZoneMode: args => {
                const zone = this.zones.findZoneByName(args.zone);
                if (!zone) {
                    console.error(`Failed to find zone for ${args.zone}`);
                    return false;
                }
                if (args.mode === 'enabled') {
                    console.log(`A flow enabled ${zone.getId()} as ${zone.getName()}`);
                    this.settingsManager.addZoneEnabled(zone.getId());
                }
                else if (args.mode === 'disabled') {
                    console.log(`A flow disabled ${zone.getId()} as ${zone.getName()}`);
                    this.settingsManager.addZoneDisabled(zone.getId());
                }
                else if (args.mode === 'monitored') {
                    console.log(`A flow set ${zone.getId()} as ${zone.getName()} to monitored`);
                    this.settingsManager.addZoneMonitored(zone.getId());
                }
                else {
                    console.error(`A flow set unkown mode (${args.mode}) for ${args.zone}`);
                    return false;
                }
                return true;
            },
        });
        this.settingsManager = new SettingsManager_1.SettingsManager({
            onAppState: (state) => {
                if (state.zones) {
                    this.zones.setState(state.zones);
                }
            },
            onDeviceConfigUpdated: (config) => __awaiter(this, void 0, void 0, function* () {
                yield this.zones.updateDevices(config.zonesIgnored || [], config.zonesNotMonitored || [], config.devicesIgnored || []);
            }),
            onSettingsUpdated: (settings) => __awaiter(this, void 0, void 0, function* () {
                this.zones.onUpdateSettings(settings);
                yield this.jobManager.onSettinsUpdated(settings.dailyReset);
            }),
        });
        this.jobManager = new JobManager_1.JobManager({
            onResetMaxMin: () => {
                console.log('Reseting all zones max/min temperatures: ' + new Date());
                this.zones.resetMaxMin();
            },
        });
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Booting temperature manager`);
            this.api = yield athom_api_1.HomeyAPI.forCurrentHomey();
            this.deviceManager = new DeviceManager_1.DeviceManager(this.api, this.zones);
            yield this.settingsManager.start();
            yield this.jobManager.start();
            this.triggers.register();
            this.actions.register();
            this.triggers.disable();
            yield this.deviceManager.start();
            this.triggers.enable();
            for (const key in this.listeners) {
                for (const cb of this.listeners[key]) {
                    cb();
                }
            }
            console.log(`${this.zones.countDevices()} devices monitored, enabling triggers`);
            this.loaded = true;
        });
    }
    getTriggers() {
        return this.triggers.get();
    }
    getZones() {
        return this.zones.getAll();
    }
    subscribeToZone(id, callback) {
        if (id in this.listeners) {
            this.listeners[id].push(callback);
        }
        else {
            this.listeners[id] = [callback];
        }
        if (this.loaded) {
            callback();
        }
    }
    getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.devices.getDevices();
        });
    }
}
__decorate([
    utils_1.Catch()
], TempManager.prototype, "onInit", null);
exports.TempManager = TempManager;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(1);
class ActionManager {
    constructor(handler) {
        this.handler = handler;
        this.cards = {};
        for (const id in handler) {
            try {
                this.cards[id] = new homey_1.FlowCardAction(id);
            }
            catch (error) {
                console.error(`Failed to register action card ${id}: `, error);
            }
        }
    }
    register() {
        console.log(`Registering ${Object.keys(this.cards).length} actions`);
        for (const id in this.cards) {
            this.cards[id].register().registerRunListener((args, state) => {
                console.log(this.handler[id](args));
                return Promise.resolve(this.handler[id](args));
            });
        }
    }
}
__decorate([
    utils_1.Catch()
], ActionManager.prototype, "register", null);
exports.ActionManager = ActionManager;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay = time => new Promise(res => setTimeout(res, time));
const isThermometer = (device) => {
    if (device.capabilitiesObj) {
        return 'measure_temperature' in device.capabilitiesObj;
    }
    else if (device.capabilities) {
        return 'measure_temperature' in device.capabilities;
    }
    console.log(`Failed to finc capabilities list from: `, device);
    return false;
};
class DeviceManager {
    constructor(api, zones) {
        this.api = api;
        this.zones = zones;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting device manager');
            this.setupDeviceSubscription();
            this.setupZoneSubscriptions();
            yield Promise.all([this.scanZones(), yield this.scanDevices()]);
        });
    }
    setupDeviceSubscription() {
        this.api.devices.on('device.create', (device) => __awaiter(this, void 0, void 0, function* () { return yield this.onDeviceCreate(device); }));
        this.api.devices.on('device.update', (device) => __awaiter(this, void 0, void 0, function* () { return yield this.onDeviceUpdate(device); }));
        this.api.devices.on('device.delete', (device) => __awaiter(this, void 0, void 0, function* () { return yield this.onDeviceDelete(device); }));
    }
    onDeviceCreate(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!isThermometer(device)) {
                    return;
                }
                const readyDevice = yield this.waitForDevice(device, 12);
                if (readyDevice) {
                    yield this.addDevice(readyDevice);
                }
            }
            catch (error) {
                console.error(`Failed to handle device.create: ${error}`);
            }
        });
    }
    onDeviceUpdate(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!isThermometer(device)) {
                    return;
                }
                const d = this.zones.findDevice(device.id);
                if (!d) {
                    return;
                }
                if (d && d.getZoneId() !== device.zone) {
                    yield this.zones.moveDevice(d, d.getZoneId(), device.zone, device.zoneName);
                }
                if (d.name !== device.name) {
                    d.setName(device.name);
                }
            }
            catch (error) {
                console.error(`Failed to handle device.update: ${error}`, error);
            }
        });
    }
    onDeviceDelete(device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.zones.removeDeviceById(device.id);
            }
            catch (error) {
                console.error(`Failed to handle device.delete: ${error}`);
            }
        });
    }
    setupZoneSubscriptions() {
        this.api.zones.on('zone.create', (zone) => __awaiter(this, void 0, void 0, function* () { return yield this.onZoneCreate(zone); }));
        this.api.zones.on('zone.update', (zone) => __awaiter(this, void 0, void 0, function* () { return yield this.onZoneUpdate(zone); }));
        this.api.zones.on('zone.delete', (zone) => __awaiter(this, void 0, void 0, function* () { return yield this.onZoneDelete(zone); }));
    }
    onZoneCreate(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.zones.addZone(zone.id, zone.name);
            }
            catch (error) {
                console.error(`Failed to handle zone.create: ${error}`);
            }
        });
    }
    onZoneUpdate(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!zone) {
                    console.log('Why is the zone empty: ', zone);
                    return;
                }
                const z = this.zones.getZoneById(zone.id);
                if (z && z.getName() !== zone.name) {
                    z.setName(zone.name);
                }
            }
            catch (err) {
                console.error('Failed to handle zone.update: ', err, zone);
            }
        });
    }
    onZoneDelete(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.zones.removeZone(zone.id);
            }
            catch (error) {
                console.error(`Failed to handle zone.delete: ${error}`);
            }
        });
    }
    scanZones() {
        return __awaiter(this, void 0, void 0, function* () {
            const allZones = yield this.api.zones.getZones();
            for (const id in allZones) {
                this.zones.addZone(id, allZones[id].name);
            }
        });
    }
    scanDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const allDevices = yield this.api.devices.getDevices();
            for (const id in allDevices) {
                if (!isThermometer(allDevices[id])) {
                    if (!allDevices[id].ready) {
                        console.log('Skipping: ', allDevices[id]);
                    }
                    continue;
                }
                if (allDevices[id].driverUri === 'homey:app:medin.name.temperatures') {
                    console.log(`Ignoring my own thermometer: ${allDevices[id].driverUri}`);
                    continue;
                }
                const device = yield this.waitForDevice(allDevices[id], 12);
                if (device) {
                    yield this.addDevice(device);
                }
            }
        });
    }
    waitForDevice(device, timeToWait) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDevice = yield this.api.devices.getDevice({ id: device.id });
            if (resultDevice.ready) {
                return resultDevice;
            }
            yield delay(1000);
            if (timeToWait > 0) {
                return yield this.waitForDevice(device, timeToWait--);
            }
            else {
                console.log('Found Device, not ready:    ' + resultDevice.name);
                this.devicesNotReadyAtStart.push(resultDevice.name);
                return false;
            }
        });
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.zones.addDevice(device);
            device.makeCapabilityInstance('measure_temperature', (temperature) => __awaiter(this, void 0, void 0, function* () {
                yield t.update(temperature);
            }));
        });
    }
}
exports.DeviceManager = DeviceManager;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __webpack_require__(0);
const taskname = 'dailyreset';
class JobManager {
    constructor(listener) {
        this.dailyReset = 'never';
        this.task = undefined;
        this.listener = listener;
    }
    onSettinsUpdated(dailyReset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dailyReset !== dailyReset) {
                this.dailyReset = dailyReset;
                yield this.start();
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('installing scheduled tasks');
                try {
                    const tasks = (yield homey_1.ManagerCron.getTasks(taskname));
                    for (const task of tasks) {
                        console.log(`Uninstalling task: ${task.id}`);
                        yield homey_1.ManagerCron.unregisterTask(task.id);
                    }
                }
                catch (error) {
                    console.log('Failed to remove existing job', error);
                }
                if (this.dailyReset !== 'never') {
                    const cron = this.getDailyRestCron();
                    console.log(`Updated time to: ${cron}`);
                    this.task = yield homey_1.ManagerCron.registerTask(taskname, cron);
                    this.task.on('run', () => this.listener.onResetMaxMin());
                }
                else {
                    console.log('Reseting of max/min temperatures is disabled');
                }
            }
            catch (error) {
                console.log('Failed to reset task', error);
            }
        });
    }
    getDailyRestCron() {
        const parts = this.dailyReset.split(':');
        const hour = parts.length > 0 ? parts[0] : '2';
        const minute = parts.length > 1 ? parts[1] : '00';
        return `0 ${minute} ${hour} * * *`;
    }
}
exports.JobManager = JobManager;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __webpack_require__(0);
exports.defaultSettings = {
    dailyReset: '02:00',
    maxTemperature: 22,
    minTemperature: 18,
};
const defaultDeviceConfig = {
    devicesIgnored: [],
    zonesIgnored: [],
    zonesNotMonitored: [],
};
class SettingsManager {
    constructor(listener) {
        this.listener = listener;
        this.settings = Object.assign({}, exports.defaultSettings);
        this.deviceConfig = Object.assign({}, defaultDeviceConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(Object.assign({}, exports.defaultSettings), (homey_1.ManagerSettings.get('settings') || exports.defaultSettings));
            yield this.listener.onSettingsUpdated(this.settings);
            this.deviceConfig.zonesIgnored = homey_1.ManagerSettings.get('zonesIgnored') || [];
            this.deviceConfig.zonesNotMonitored = homey_1.ManagerSettings.get('zonesNotMonitored') || [];
            this.deviceConfig.devicesIgnored = homey_1.ManagerSettings.get('devicesIgnored') || [];
            yield this.listener.onDeviceConfigUpdated(this.deviceConfig);
            this.subscribe();
            const state = homey_1.ManagerSettings.get('state');
            if (state) {
                console.log(`Restoring state: `);
                yield this.listener.onAppState(state);
            }
        });
    }
    setState(state) {
        homey_1.ManagerSettings.set('state', state);
    }
    getSettings() {
        return this.settings;
    }
    setSettings(settings) {
        homey_1.ManagerSettings.set('settings', Object.assign(Object.assign({}, this.settings), settings));
    }
    addZoneMonitored(zoneId) {
        this.deviceConfig.zonesNotMonitored = this.removeFromList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
        this.deviceConfig.zonesIgnored = this.removeFromList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
    }
    addZoneEnabled(zoneId) {
        this.deviceConfig.zonesNotMonitored = this.addToList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
        this.deviceConfig.zonesIgnored = this.removeFromList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
    }
    addZoneDisabled(zoneId) {
        this.deviceConfig.zonesIgnored = this.addToList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
        this.deviceConfig.zonesNotMonitored = this.addToList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
    }
    subscribe() {
        homey_1.ManagerSettings.on('set', (variable) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (variable === 'settings') {
                    const settings = homey_1.ManagerSettings.get('settings');
                    console.log(`Allowed temperature span: ${settings.minTemperature} - ${settings.maxTemperature}`);
                    console.log(`Reset max/min running at: ${settings.dailyReset}`);
                    this.settings = Object.assign({}, settings);
                    yield this.listener.onSettingsUpdated(this.settings);
                }
                else if (variable === 'zonesIgnored') {
                    this.deviceConfig.zonesIgnored = homey_1.ManagerSettings.get('zonesIgnored') || [];
                    yield this.listener.onDeviceConfigUpdated(this.deviceConfig);
                }
                else if (variable === 'zonesNotMonitored') {
                    this.deviceConfig.zonesNotMonitored = homey_1.ManagerSettings.get('zonesNotMonitored') || [];
                    yield this.listener.onDeviceConfigUpdated(this.deviceConfig);
                }
                else if (variable === 'devicesIgnored') {
                    this.deviceConfig.devicesIgnored = homey_1.ManagerSettings.get('devicesIgnored') || [];
                    yield this.listener.onDeviceConfigUpdated(this.deviceConfig);
                }
            }
            catch (error) {
                console.error(`Failed to update settings: ${error}`);
            }
        }));
    }
    removeFromList(list, name, value) {
        const i = list.indexOf(value);
        if (i !== -1) {
            list.splice(i, 1);
            homey_1.ManagerSettings.set(name, list);
        }
        return list;
    }
    addToList(list, name, value) {
        if (list.indexOf(value) === -1) {
            list.push(value);
            homey_1.ManagerSettings.set(name, list);
        }
        return list;
    }
}
exports.SettingsManager = SettingsManager;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(1);
class TriggerManager {
    constructor(functions) {
        this.enabled = true;
        this.wrapper = {};
        this.cards = {};
        for (const id of functions) {
            try {
                console.log(`Registring function: ${id}`);
                this.cards[id] = new homey_1.FlowCardTrigger(id);
                this.wrapper[id] = (args) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.enabled) {
                        return;
                    }
                    yield this.cards[id].trigger(args);
                });
            }
            catch (error) {
                console.error(`Failed to register action card ${id}: `, error);
            }
        }
    }
    get() {
        return this.wrapper;
    }
    register() {
        console.log('Registering triggers');
        for (const id in this.cards) {
            this.cards[id].register();
        }
    }
    enable() {
        console.log('Enabling all triggers');
        this.enabled = true;
    }
    disable() {
        console.log('Disabling all triggers');
        this.enabled = false;
    }
}
__decorate([
    utils_1.Catch()
], TriggerManager.prototype, "register", null);
exports.TriggerManager = TriggerManager;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Zone_1 = __webpack_require__(13);
class Zones {
    constructor(triggerManager, listener) {
        this.triggerManager = triggerManager;
        this.listener = listener;
        this.zones = {};
        this.zonesIgnored = [];
        this.zonesNotMonitored = [];
        this.devicesIgnored = [];
    }
    resetMaxMin() {
        for (const key in this.zones) {
            this.zones[key].resetMaxMin();
        }
    }
    addZone(id, name) {
        if (id in this.zones) {
            return this.zones[id];
        }
        const zone = new Zone_1.Zone(this.triggerManager, this.listener, id, name, this.zonesIgnored.includes(id), this.zonesNotMonitored.includes(id), this.devicesIgnored);
        if (this.settings) {
            zone.onUpdateSettings(this.settings);
        }
        if (this.state && zone.getId() in this.state) {
            zone.setState(this.state[zone.getId()]);
            delete this.state[zone.getId()];
        }
        this.zones[id] = zone;
        return zone;
    }
    getZoneById(id) {
        if (id in this.zones) {
            return this.zones[id];
        }
    }
    findZoneByName(name) {
        for (const key in this.zones) {
            if (this.zones[key].getName() === name) {
                return this.zones[key];
            }
        }
        return undefined;
    }
    removeZone(id) {
        const zone = this.getZoneById(id);
        if (zone) {
            delete this.zones[id];
        }
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const zone = this.addZone(device.zone, device.zoneName);
            return yield zone.addDevice(device);
        });
    }
    removeDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in this.zones) {
                yield this.zones[key].removeDevice(id);
            }
        });
    }
    findDevice(id) {
        for (const key in this.zones) {
            const d = this.zones[key].findDevice(id);
            if (d) {
                return d;
            }
        }
        return undefined;
    }
    moveDevice(thermometer, oldZoneId, newZoneId, zoneName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newZone = this.addZone(newZoneId, zoneName || 'unknown');
            const oldZone = this.addZone(oldZoneId, 'unknown');
            console.log(`Moving thermometer from ${oldZone.getName()} to ${newZone.getName()}`);
            yield newZone.addThermometer(thermometer);
            yield oldZone.removeDevice(thermometer.id);
            thermometer.setZone(newZone);
        });
    }
    countDevices() {
        return Object.values(this.zones).map(z => z.countDevices()).reduce((t, v) => t + v, 0);
    }
    getAll() {
        return this.zones;
    }
    getState() {
        const state = {};
        for (const key in this.zones) {
            state[key] = this.zones[key].getState();
        }
        return state;
    }
    setState(state) {
        this.state = state;
    }
    onUpdateSettings(settings) {
        this.settings = settings;
        for (const key in this.zones) {
            this.zones[key].onUpdateSettings(settings);
        }
    }
    updateDevices(zonesIgnored, zonesNotMonitored, devicesIgnored) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.zonesIgnored !== zonesIgnored) {
                this.zonesIgnored = zonesIgnored;
                for (const key in this.zones) {
                    yield this.zones[key].setIgnored(this.zonesIgnored.includes(key));
                }
            }
            if (this.zonesNotMonitored !== zonesNotMonitored) {
                this.zonesNotMonitored = zonesNotMonitored;
                for (const key in this.zones) {
                    yield this.zones[key].setNotMonitored(this.zonesNotMonitored.includes(key));
                }
            }
            if (this.devicesIgnored !== devicesIgnored) {
                this.devicesIgnored = devicesIgnored;
                for (const key in this.zones) {
                    yield this.zones[key].setDevicesIgnored(this.devicesIgnored);
                }
            }
        });
    }
}
exports.Zones = Zones;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Average_1 = __importDefault(__webpack_require__(14));
const Thermometer_1 = __webpack_require__(15);
const utils_1 = __webpack_require__(1);
class Zone {
    constructor(triggers, listener, id, name, ignored, notMonitored, devicesIgnored) {
        this.triggers = triggers;
        this.listener = listener;
        this.id = id;
        this.name = name;
        this.devices = [];
        this.dailyMinTemp = undefined;
        this.dailyMaxTemp = undefined;
        this.currentMinTemp = undefined;
        this.currentMaxTemp = undefined;
        this.current = undefined;
        this.ignored = ignored;
        this.notMonitored = notMonitored;
        this.devicesIgnored = devicesIgnored;
        this.avg = new Average_1.default();
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getTemperature() {
        return this.current;
    }
    getDailyMin() {
        return this.dailyMinTemp;
    }
    getDailyMax() {
        return this.dailyMaxTemp;
    }
    getCurrentMin() {
        return this.currentMinTemp;
    }
    getCurrentMax() {
        return this.currentMaxTemp;
    }
    getAvg() {
        return this.avg.get();
    }
    hasDevice() {
        return this.devices.length > 0;
    }
    countDevices() {
        return this.devices.length;
    }
    onUpdateSettings(settings) {
        this.minAllowed = settings.minTemperature;
        this.maxAllowed = settings.maxTemperature;
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addThermometer(new Thermometer_1.Thermometer(this, device, this.devicesIgnored.includes(device.id)));
        });
    }
    addThermometer(thermometer) {
        return __awaiter(this, void 0, void 0, function* () {
            thermometer.setZone(this);
            this.devices.push(thermometer);
            if (thermometer.hasTemp()) {
                yield this.onDeviceUpdated(thermometer);
            }
            return thermometer;
        });
    }
    removeDevice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.devices.length; i++) {
                if (this.devices[i].id === id) {
                    this.devices.splice(i, 1);
                    console.log(`Removing ${id} from ${this.name} yielded: `, this.devices.map(t => t.id));
                    yield this.calculateZoneTemp();
                    return;
                }
            }
        });
    }
    setIgnored(ignored) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignored !== ignored) {
                console.log(`Zone ignore status changed for ${this.name} to ${ignored}`);
                this.ignored = ignored;
                yield this.calculateZoneTemp();
            }
        });
    }
    setNotMonitored(notMonitored) {
        if (this.notMonitored !== notMonitored) {
            this.notMonitored = notMonitored;
            console.log(`Zone not-monitored status changed for ${this.name} to ${notMonitored}`);
        }
    }
    setDevicesIgnored(devicesIgnored) {
        return __awaiter(this, void 0, void 0, function* () {
            this.devicesIgnored = devicesIgnored;
            let hasChanged = false;
            for (const device of this.devices) {
                if (device.setIgnored(this.devicesIgnored.includes(device.id))) {
                    hasChanged = true;
                }
            }
            if (hasChanged) {
                yield this.calculateZoneTemp();
            }
        });
    }
    resetMaxMin() {
        this.dailyMinTemp = undefined;
        this.dailyMaxTemp = undefined;
        this.avg.reset();
    }
    onDeviceUpdated(thermometer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignored) {
                return;
            }
            if (!(yield this.calculateZoneTemp())) {
                return;
            }
            if (this.dailyMinTemp === undefined) {
                yield this.onMinUpdated(thermometer.name, thermometer.temp);
            }
            else {
                const minTemp = Math.min(this.dailyMinTemp, thermometer.temp);
                if (this.dailyMinTemp !== minTemp) {
                    yield this.onMinUpdated(thermometer.name, thermometer.temp);
                }
            }
            if (this.dailyMaxTemp === undefined) {
                yield this.onMaxUpdated(thermometer.name, thermometer.temp);
            }
            else {
                const maxTemp = Math.max(this.dailyMaxTemp, thermometer.temp);
                if (this.dailyMaxTemp !== maxTemp) {
                    yield this.onMaxUpdated(thermometer.name, thermometer.temp);
                }
            }
            this.listener.onZoneUpdated(this.id);
        });
    }
    getState() {
        return {
            average: this.avg.getState(),
            dailyMax: this.dailyMaxTemp,
            dailyMin: this.dailyMinTemp,
            maxTemp: this.dailyMaxTemp,
            minTemp: this.dailyMinTemp,
        };
    }
    setState(state) {
        this.dailyMaxTemp = state.maxTemp;
        this.dailyMinTemp = state.minTemp;
        if (state.dailyMax) {
            this.dailyMaxTemp = state.dailyMax;
        }
        if (state.dailyMin) {
            this.dailyMinTemp = state.dailyMin;
        }
        if (state.average) {
            this.avg.setState(state.average);
        }
    }
    findDevice(id) {
        for (const d of this.devices) {
            if (d.id === id) {
                return d;
            }
        }
        return undefined;
    }
    calculateZoneTemp() {
        return __awaiter(this, void 0, void 0, function* () {
            let curMin;
            let curMax;
            if (this.ignored) {
                this.current = undefined;
                return false;
            }
            let avgTemp = 0;
            let count = 0;
            for (const device of this.devices) {
                if (device.hasTemp()) {
                    if (curMax === undefined) {
                        curMax = device.temp;
                    }
                    else if (device.temp > curMax) {
                        curMax = device.temp;
                    }
                    if (curMin === undefined) {
                        curMin = device.temp;
                    }
                    else if (device.temp < curMin) {
                        curMin = device.temp;
                    }
                    avgTemp += device.temp;
                    count++;
                }
            }
            if (count > 0) {
                this.currentMaxTemp = curMax;
                this.currentMinTemp = curMin;
                const newCurrent = Math.round((avgTemp / count) * 10) / 10;
                if (newCurrent !== this.current) {
                    this.current = newCurrent;
                    yield this.onTempUpdated();
                    return true;
                }
            }
            else {
                if (this.current) {
                    this.current = undefined;
                    return true;
                }
            }
            return false;
        });
    }
    onMaxUpdated(name, temperature) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dailyMaxTemp = temperature;
            yield this.triggers.MaxTemperatureChanged({ zone: this.name, sensor: name, temperature: this.dailyMaxTemp });
        });
    }
    onMinUpdated(name, temperature) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dailyMinTemp = temperature;
            yield this.triggers.MinTemperatureChanged({ zone: this.name, sensor: name, temperature: this.dailyMinTemp });
        });
    }
    onTempUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.avg.update(this.current);
            yield this.triggers.TemperatureChanged({ zone: this.name, temperature: this.current });
            if (!this.notMonitored) {
                if (this.current > this.maxAllowed) {
                    yield this.triggers.TooWarm({ zone: this.name, temperature: this.current });
                }
                else if (this.current < this.minAllowed) {
                    yield this.triggers.TooCold({ zone: this.name, temperature: this.current });
                }
            }
        });
    }
}
__decorate([
    utils_1.Catch()
], Zone.prototype, "onDeviceUpdated", null);
exports.Zone = Zone;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Average {
    constructor() {
        this.value = undefined;
        this.seconds = undefined;
        this.lastUpdate = undefined;
        this.lastValue = undefined;
    }
    reset() {
        if (this.lastUpdate === undefined) {
            return;
        }
        this.value = 0;
        this.seconds = 0;
        this.lastUpdate = Date.now();
    }
    update(value) {
        if (this.lastUpdate === undefined || this.lastValue === undefined) {
            this.value = value;
            this.lastValue = value;
            this.seconds = 0;
            this.lastUpdate = Date.now();
            return;
        }
        const now = Date.now();
        const delta = now - this.lastUpdate;
        const seconds = Math.round(delta / 1000);
        if (seconds > 1) {
            this.value += (this.lastValue * (seconds - 1)) + value;
            this.seconds += seconds;
        }
        else if (seconds === 1) {
            this.value += value;
            this.seconds++;
        }
        else {
            // No time has passed, do nothing...
        }
        this.lastValue = value;
        this.lastUpdate = now;
    }
    get() {
        if (this.lastValue === undefined || this.value === undefined || this.seconds === undefined) {
            return undefined;
        }
        this.update(this.lastValue);
        if (this.seconds === 0) {
            return Math.round(this.lastValue * 100) / 100;
        }
        return Math.round(this.value / this.seconds * 100) / 100;
    }
    getState() {
        if (!this.lastUpdate || !this.lastValue || !this.seconds || !this.value) {
            return undefined;
        }
        return {
            lastUpdate: this.lastUpdate,
            lastValue: this.lastValue,
            seconds: this.seconds,
            value: this.value,
        };
    }
    setState(state) {
        if (!state) {
            return;
        }
        this.lastUpdate = state.lastUpdate;
        this.lastValue = state.lastValue;
        this.seconds = state.seconds;
        this.value = state.value;
    }
}
exports.default = Average;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Thermometer {
    constructor(zone, device, ignored) {
        this.zone = zone;
        this.id = device.id;
        this.name = device.name;
        this.temp =
            device.capabilitiesObj &&
                device.capabilitiesObj.measure_temperature &&
                device.capabilitiesObj.measure_temperature.value
                ? +device.capabilitiesObj.measure_temperature.value
                : undefined;
        this.ignored = ignored;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getZone() {
        return this.zone.getName();
    }
    getZoneId() {
        return this.zone.getId();
    }
    setZone(zone) {
        this.zone = zone;
    }
    update(temp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.temp === temp) {
                return false;
            }
            this.temp = temp;
            yield this.zone.onDeviceUpdated(this);
            return true;
        });
    }
    setIgnored(ignored) {
        if (this.ignored !== ignored) {
            console.log(`Device ignored status changed for ${this.name} to ${ignored}`);
            this.ignored = ignored;
            return true;
        }
        return false;
    }
    hasTemp() {
        if (this.ignored) {
            return false;
        }
        return this.temp !== undefined;
    }
}
exports.Thermometer = Thermometer;


/***/ })
/******/ ]);
});