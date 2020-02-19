(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("homey"), require("athom-api"));
	else if(typeof define === 'function' && define.amd)
		define(["homey", "athom-api"], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory(require("homey"), require("athom-api"));
	else
		root["library"] = factory(root["homey"], root["athom-api"]);
})(global, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__7__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
let logs = [];
let logEnabled = true;
function logRaw(level, message) {
    if (!logEnabled) {
        return;
    }
    logs.push({
        date: new Date(),
        level,
        message,
    });
    if (logs.length > 500) {
        logs = logs.slice(logs.length - 500);
    }
}
function log(message) {
    logRaw('ok', message);
    console.log(message);
}
exports.log = log;
function error(message) {
    logRaw('error', message);
    console.error(message);
}
exports.error = error;
function debug(message) {
    logRaw('debug', message);
    console.log(message);
}
exports.debug = debug;
function get() {
    return logs;
}
exports.get = get;
function enableLog() {
    logEnabled = true;
}
exports.enableLog = enableLog;
function disableLog() {
    logEnabled = false;
}
exports.disableLog = disableLog;


/***/ }),
/* 2 */
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
/* 3 */,
/* 4 */,
/* 5 */
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
const TemperatureManager_1 = __webpack_require__(6);
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
/* 6 */
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
const athom_api_1 = __webpack_require__(7);
const ActionManager_1 = __webpack_require__(8);
const DeviceManager_1 = __webpack_require__(9);
const JobManager_1 = __webpack_require__(10);
const LogManager_1 = __webpack_require__(1);
const SettingsManager_1 = __webpack_require__(11);
const TriggerManager_1 = __webpack_require__(12);
const utils_1 = __webpack_require__(2);
const Zones_1 = __webpack_require__(13);
class TempManager {
    constructor() {
        this.loaded = false;
        LogManager_1.log(`Starting temperature manager`);
        this.api = undefined;
        this.listeners = {};
        this.triggers = new TriggerManager_1.TriggerManager([
            'TemperatureChanged',
            'TooCold',
            'TooWarm',
            'MinTemperatureChanged',
            'MaxTemperatureChanged',
            'HumidityChanged',
            'TooDry',
            'TooHumid',
            'MinHumidityChanged',
            'MaxHumidityChanged',
        ]);
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
                    LogManager_1.log(`A flow updated the minimum temperature bound to ${args.temperature}`);
                    this.settingsManager.setSettings({ minTemperature: args.temperature });
                }
                else if (args.type === 'max') {
                    LogManager_1.log(`A flow updated the maximum temperature bound to ${args.temperature}`);
                    this.settingsManager.setSettings({ maxTemperature: args.temperature });
                }
                else {
                    LogManager_1.error(`Unknown bound ${args.type}`);
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
                    LogManager_1.log(`A flow enabled ${zone.getId()} as ${zone.getName()}`);
                    this.settingsManager.addZoneEnabled(zone.getId());
                }
                else if (args.mode === 'disabled') {
                    LogManager_1.log(`A flow disabled ${zone.getId()} as ${zone.getName()}`);
                    this.settingsManager.addZoneDisabled(zone.getId());
                }
                else if (args.mode === 'monitored') {
                    LogManager_1.log(`A flow set ${zone.getId()} as ${zone.getName()} to monitored`);
                    this.settingsManager.addZoneMonitored(zone.getId());
                }
                else {
                    LogManager_1.error(`A flow set unkown mode (${args.mode}) for ${args.zone}`);
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
                LogManager_1.log('Reseting all zones max/min temperatures: ' + new Date());
                this.zones.resetMaxMin();
            },
        });
    }
    getLogs() {
        return LogManager_1.get();
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            LogManager_1.log(`Booting temperature manager`);
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
            LogManager_1.log(`${this.zones.countDevices()} devices monitored, enabling triggers`);
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
        return this.zones.getAllDevices();
    }
}
__decorate([
    utils_1.Catch()
], TempManager.prototype, "getLogs", null);
__decorate([
    utils_1.Catch()
], TempManager.prototype, "onInit", null);
exports.TempManager = TempManager;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__7__;

/***/ }),
/* 8 */
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
const LogManager_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(2);
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
        LogManager_1.log(`Registering ${Object.keys(this.cards).length} actions`);
        for (const id in this.cards) {
            this.cards[id].register().registerRunListener((args, state) => {
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
const LogManager_1 = __webpack_require__(1);
const delay = time => new Promise(res => setTimeout(res, time));
const isThermometer = (device) => {
    if (device.capabilitiesObj) {
        return 'measure_temperature' in device.capabilitiesObj;
    }
    else if (device.capabilities) {
        return 'measure_temperature' in device.capabilities;
    }
    LogManager_1.error(`Failed to find capabilities list from ${device.name}`);
    return false;
};
const isHydrometer = (device) => {
    if (device.capabilitiesObj) {
        return 'measure_humidity' in device.capabilitiesObj;
    }
    else if (device.capabilities) {
        return 'measure_humidity' in device.capabilities;
    }
    LogManager_1.error(`Failed to find capabilities list from ${device.name}`);
    return false;
};
const hasBattery = (device) => {
    if (device.capabilitiesObj) {
        return 'measure_battery' in device.capabilitiesObj;
    }
    else if (device.capabilities) {
        return 'measure_battery' in device.capabilities;
    }
    LogManager_1.error(`Failed to find capabilities list from ${device.name}`);
    return false;
};
class DeviceManager {
    constructor(api, zones) {
        this.api = api;
        this.zones = zones;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setupDeviceSubscription();
            this.setupZoneSubscriptions();
            return yield Promise.all([this.scanZones(), yield this.scanDevices()]);
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
                if (!isThermometer(device) && !isHydrometer(device)) {
                    return;
                }
                const readyDevice = yield this.waitForDevice(device, 12);
                if (readyDevice) {
                    yield this.addDevice(readyDevice);
                }
                else {
                    LogManager_1.error(`Device not ready: ${device.id}`);
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
                if (!isThermometer(device) && !isHydrometer(device)) {
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
                this.zones.addZone(zone.id, zone.name, zone.icon);
            }
            catch (error) {
                console.error(`Failed to handle zone.create: ${error}`);
            }
        });
    }
    onZoneUpdate(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const z = this.zones.getZoneById(zone.id);
                if (z && z.getName() !== zone.name) {
                    z.setName(zone.name);
                }
            }
            catch (err) {
                LogManager_1.error(`Failed to handle zone update of ${zone.name}: ${err}`);
            }
        });
    }
    onZoneDelete(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.zones.removeZone(zone.id);
            }
            catch (error) {
                error(`Failed to handle delete of zone ${zone.id}: ${error}`);
            }
        });
    }
    scanZones() {
        return __awaiter(this, void 0, void 0, function* () {
            const allZones = yield this.api.zones.getZones();
            for (const id in allZones) {
                this.zones.addZone(id, allZones[id].name, allZones[id].icon);
            }
            return true;
        });
    }
    scanDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const allDevices = yield this.api.devices.getDevices();
            for (const id in allDevices) {
                if (!isThermometer(allDevices[id]) && !isHydrometer(allDevices[id])) {
                    if (!allDevices[id].ready) {
                        LogManager_1.log(`Device not ready, skipping: ${allDevices[id]}`);
                    }
                    continue;
                }
                if (allDevices[id].driverUri === 'homey:app:medin.name.temperatures' ||
                    allDevices[id].driverUri === 'homey:app:name.medin.temperatures') {
                    LogManager_1.debug(`Ignoring my own thermometer: ${allDevices[id].driverUri}`);
                    continue;
                }
                const device = yield this.waitForDevice(allDevices[id], 12);
                if (device) {
                    yield this.addDevice(device);
                }
            }
            return true;
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
                LogManager_1.log(`Found Device, not ready: ${resultDevice.name}`);
                this.devicesNotReadyAtStart.push(resultDevice.name);
                return false;
            }
        });
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield this.zones.addDevice(device);
            if (isThermometer(device)) {
                device.makeCapabilityInstance('measure_temperature', (temperature) => __awaiter(this, void 0, void 0, function* () {
                    yield t.update_temperature(temperature);
                }));
            }
            if (isHydrometer(device)) {
                device.makeCapabilityInstance('measure_humidity', (humidity) => __awaiter(this, void 0, void 0, function* () {
                    yield t.update_humidity(humidity);
                }));
            }
            if (hasBattery(device)) {
                device.makeCapabilityInstance('measure_battery', (level) => __awaiter(this, void 0, void 0, function* () {
                    yield t.update_battery(level);
                }));
            }
        });
    }
}
exports.DeviceManager = DeviceManager;


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
const LogManager_1 = __webpack_require__(1);
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
                LogManager_1.log('installing scheduled tasks');
                try {
                    const tasks = yield homey_1.ManagerCron.getTasks(taskname);
                    for (const task of tasks) {
                        LogManager_1.debug(`Uninstalling task: ${task.id}`);
                        yield homey_1.ManagerCron.unregisterTask(task.id);
                    }
                }
                catch (err) {
                    LogManager_1.error(`Failed to remove existing job: ${err}`);
                }
                if (this.dailyReset !== 'never') {
                    const cron = this.getDailyRestCron();
                    LogManager_1.debug(`Updated time to: ${cron}`);
                    this.task = yield homey_1.ManagerCron.registerTask(taskname, cron);
                    this.task.on('run', () => this.listener.onResetMaxMin());
                }
                else {
                    LogManager_1.log('Reseting of max/min temperatures is disabled');
                }
            }
            catch (err) {
                LogManager_1.error(`Failed to reset task: ${err}`);
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
/* 11 */
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
const LogManager_1 = __webpack_require__(1);
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
                LogManager_1.log(`Restoring state: `);
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
                    LogManager_1.log(`Allowed temperature span: ${settings.minTemperature} - ${settings.maxTemperature}`);
                    LogManager_1.log(`Reset max/min running at: ${settings.dailyReset}`);
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
/* 12 */
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
const LogManager_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(2);
class TriggerManager {
    constructor(functions) {
        this.enabled = true;
        this.wrapper = {};
        this.cards = {};
        for (const id of functions) {
            try {
                LogManager_1.log(`Registring function: ${id}`);
                this.cards[id] = new homey_1.FlowCardTrigger(id);
                this.wrapper[id] = (args) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.enabled) {
                        return;
                    }
                    yield this.cards[id].trigger(args);
                });
            }
            catch (err) {
                LogManager_1.error(`Failed to register action card ${id}: ${err}`);
            }
        }
    }
    get() {
        return this.wrapper;
    }
    register() {
        LogManager_1.log('Registering triggers');
        for (const id in this.cards) {
            this.cards[id].register();
        }
    }
    enable() {
        LogManager_1.log('Enabling all triggers');
        this.enabled = true;
    }
    disable() {
        LogManager_1.log('Disabling all triggers');
        this.enabled = false;
    }
}
__decorate([
    utils_1.Catch()
], TriggerManager.prototype, "register", null);
exports.TriggerManager = TriggerManager;


/***/ }),
/* 13 */
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
const LogManager_1 = __webpack_require__(1);
const Zone_1 = __webpack_require__(14);
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
    addZone(id, name, icon) {
        if (id in this.zones) {
            if (icon !== 'unknown' && this.zones[id].icon === 'unknown') {
                this.zones[id].icon = icon;
            }
            return this.zones[id];
        }
        const zone = new Zone_1.Zone(this.triggerManager, this.listener, id, name, icon, this.zonesIgnored.includes(id), this.zonesNotMonitored.includes(id), this.devicesIgnored);
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
            const zone = this.addZone(device.zone, device.zoneName, 'unknown');
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
            const newZone = this.addZone(newZoneId, zoneName || 'unknown', 'unknown');
            const oldZone = this.addZone(oldZoneId, 'unknown', 'unknown');
            LogManager_1.log(`Moving thermometer from ${oldZone.getName()} to ${newZone.getName()}`);
            yield newZone.addThermometer(thermometer);
            yield oldZone.removeDevice(thermometer.id);
            thermometer.setZone(newZone);
        });
    }
    countDevices() {
        return Object.values(this.zones)
            .map(z => z.countDevices())
            .reduce((t, v) => t + v, 0);
    }
    getAllDevices() {
        return [].concat.apply([], Object.values(this.zones).map(z => z.getAllDevices()));
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
/* 14 */
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
const MetricManager_1 = __importDefault(__webpack_require__(15));
const LogManager_1 = __webpack_require__(1);
const Thermometer_1 = __webpack_require__(18);
const utils_1 = __webpack_require__(2);
class Zone {
    constructor(triggers, listener, id, name, icon, ignored, notMonitored, devicesIgnored) {
        this.triggers = triggers;
        this.listener = listener;
        this.id = id;
        this.icon = icon;
        this.name = name;
        this.devices = [];
        this.ignored = ignored;
        this.notMonitored = notMonitored;
        this.devicesIgnored = devicesIgnored;
        this.temperature = new MetricManager_1.default();
        this.humidity = new MetricManager_1.default();
        this.temperature.on('currentMax', (sensor, temperature) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Maximum temperature of zone ${this.name} was updated to ${temperature}`);
            yield this.triggers.MaxTemperatureChanged({
                sensor: name === undefined ? 'unknown' : sensor,
                temperature,
                zone: this.name,
            });
        }));
        this.temperature.on('currentMin', (sensor, temperature) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Minimum temperature of zone ${this.name} was updated to ${temperature}`);
            yield this.triggers.MinTemperatureChanged({
                sensor: name === undefined ? 'unknown' : sensor,
                temperature,
                zone: this.name,
            });
        }));
        this.temperature.on('currentAvg', (sensorName, temperature) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Temperature of zone ${this.name} was updated by ${sensorName} to ${temperature}`);
            this.listener.onZoneUpdated(this.id);
            yield this.triggers.TemperatureChanged({ zone: this.name, temperature });
        }));
        this.temperature.on('underMinBound', (sensorName, temperature) => __awaiter(this, void 0, void 0, function* () {
            if (!this.notMonitored) {
                LogManager_1.debug(`Temperature of zone ${this.name}: ${temperature} is below ${this.temperature.minBound}`);
                yield this.triggers.TooCold({ zone: this.name, temperature });
            }
        }));
        this.temperature.on('overMaxBound', (sensorName, temperature) => __awaiter(this, void 0, void 0, function* () {
            if (!this.notMonitored) {
                LogManager_1.debug(`Temperature of zone ${this.name}: ${temperature} is above ${this.temperature.maxBound}`);
                yield this.triggers.TooWarm({ zone: this.name, temperature });
            }
        }));
        this.humidity.on('currentMax', (sensor, humidity) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Maximum humidity of zone ${this.name} was updated to ${humidity}`);
            yield this.triggers.MaxHumidityChanged({
                humidity,
                sensor: name === undefined ? 'unknown' : sensor,
                zone: this.name,
            });
        }));
        this.humidity.on('currentMin', (sensor, humidity) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Minimum humidity of zone ${this.name} was updated to ${humidity}`);
            yield this.triggers.MinHumidityChanged({
                humidity,
                sensor: name === undefined ? 'unknown' : sensor,
                zone: this.name,
            });
        }));
        this.humidity.on('currentAvg', (sensorName, humidity) => __awaiter(this, void 0, void 0, function* () {
            LogManager_1.debug(`Humidity of zone ${this.name} was updated by ${sensorName} to ${humidity}`);
            this.listener.onZoneUpdated(this.id);
            yield this.triggers.HumidityChanged({ zone: this.name, humidity });
        }));
        this.humidity.on('underMinBound', (sensorName, humidity) => __awaiter(this, void 0, void 0, function* () {
            if (!this.notMonitored) {
                LogManager_1.debug(`Humidity of zone ${this.name}: ${humidity} is below ${this.humidity.minBound}`);
                yield this.triggers.TooDry({ zone: this.name, humidity });
            }
        }));
        this.humidity.on('overMaxBound', (sensorName, humidity) => __awaiter(this, void 0, void 0, function* () {
            if (!this.notMonitored) {
                LogManager_1.debug(`Humidity of zone ${this.name}: ${humidity} is above ${this.humidity.maxBound}`);
                yield this.triggers.TooHumid({ zone: this.name, humidity });
            }
        }));
    }
    getAllDevices() {
        return this.devices;
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
    get periodTemp() {
        return this.temperature.period;
    }
    get currentTemp() {
        return this.temperature.current;
    }
    get periodHumidity() {
        return this.humidity.period;
    }
    get currentHumidity() {
        return this.humidity.current;
    }
    getDailyAvg() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.periodTemp.get();
        });
    }
    getCurrentAvg() {
        return this.currentTemp.average;
    }
    hasDevice() {
        return this.devices.length > 0;
    }
    countDevices() {
        return this.devices.length;
    }
    onUpdateSettings(settings) {
        LogManager_1.debug(`Setting changed for zone ${this.name}`);
        this.temperature.minBound = settings.minTemperature;
        this.temperature.maxBound = settings.maxTemperature;
        this.humidity.minBound = settings.minHumidity;
        this.humidity.maxBound = settings.maxHumidity;
    }
    addDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addThermometer(new Thermometer_1.Thermometer(this, device, this.devicesIgnored.includes(device.id)));
        });
    }
    addThermometer(thermometer) {
        return __awaiter(this, void 0, void 0, function* () {
            LogManager_1.log(`Adding device: ${thermometer.name} to zone ${this.name}`);
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
                    LogManager_1.log(`Removing thermometer: ${this.devices.map(t => t.name)} from zone ${this.name}`);
                    yield this.calculateZoneTemp(undefined);
                    return;
                }
            }
        });
    }
    setIgnored(ignored) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignored !== ignored) {
                LogManager_1.log(`Zone ignore status changed for ${this.name} to ${ignored}`);
                this.ignored = ignored;
                yield this.calculateZoneTemp(undefined);
            }
        });
    }
    setNotMonitored(notMonitored) {
        if (this.notMonitored !== notMonitored) {
            this.notMonitored = notMonitored;
            LogManager_1.log(`Zone not-monitored status changed for ${this.name} to ${notMonitored}`);
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
                yield this.calculateZoneTemp(undefined);
            }
        });
    }
    resetMaxMin() {
        LogManager_1.log(`Resetting daily averages for ${this.name}`);
        this.temperature.resetPeriod();
    }
    onDeviceUpdated(thermometer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignored) {
                LogManager_1.debug(`Device of ignored zone ${this.name} updated`);
                return;
            }
            yield this.calculateZoneTemp(thermometer.getName());
        });
    }
    getState() {
        return {
            average: this.temperature.getState(),
        };
    }
    setState(state) {
        if (state.average) {
            this.temperature.setState(state.average);
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
    calculateZoneTemp(sensor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ignored) {
                yield this.temperature.update(undefined, []);
                yield this.humidity.update(undefined, []);
            }
            else {
                yield this.temperature.update(sensor, this.devices.filter(d => d.hasTemp()).map(d => ({ name: d.name, temp: d.temp })));
                yield this.humidity.update(sensor, this.devices.filter(d => d.hasHumidity()).map(d => ({ name: d.name, temp: d.humidity })));
            }
        });
    }
}
__decorate([
    utils_1.Catch()
], Zone.prototype, "onDeviceUpdated", null);
exports.Zone = Zone;


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MomentanAverage_1 = __importDefault(__webpack_require__(16));
const PeriodAverage_1 = __importDefault(__webpack_require__(17));
class MetricManager {
    constructor() {
        this.events = {
            currentAvg: undefined,
            currentMax: undefined,
            currentMin: undefined,
            overMaxBound: undefined,
            underMinBound: undefined,
        };
        this.period = new PeriodAverage_1.default();
        this.current = new MomentanAverage_1.default();
        this.maxBound = undefined;
        this.minBound = undefined;
        this.current.on('max', (sensorName, value) => __awaiter(this, void 0, void 0, function* () { return yield this.fire('currentMax', sensorName, value); }));
        this.current.on('min', (sensorName, value) => __awaiter(this, void 0, void 0, function* () { return yield this.fire('currentMin', sensorName, value); }));
        this.current.on('avg', (sensorName, value) => __awaiter(this, void 0, void 0, function* () {
            yield this.period.update(sensorName, value);
            yield this.fire('currentAvg', sensorName, value);
            if (this.maxBound && value > this.maxBound) {
                yield this.fire('overMaxBound', sensorName, value);
            }
            else if (this.minBound && value < this.minBound) {
                yield this.fire('underMinBound', sensorName, value);
            }
        }));
    }
    resetPeriod() {
        this.period.reset();
    }
    getState() {
        return this.period.getState();
    }
    setState(state) {
        this.period.setState(state);
    }
    update(sensor, values) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.current.update(sensor, values);
        });
    }
    on(event, fun) {
        this.events[event] = fun;
    }
    fire(event, device, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== undefined && this.events[event] !== undefined) {
                yield this.events[event](device, value);
            }
        });
    }
}
exports.default = MetricManager;


/***/ }),
/* 16 */
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
class MomentanAverage {
    constructor() {
        this.events = { max: undefined, min: undefined, avg: undefined };
    }
    on(event, fun) {
        this.events[event] = fun;
    }
    fire(event, device, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== undefined && this.events[event] !== undefined) {
                yield this.events[event](device, value);
            }
        });
    }
    reset() {
        this.min = undefined;
        this.max = undefined;
        this.average = undefined;
    }
    update(sensor, values) {
        return __awaiter(this, void 0, void 0, function* () {
            if (values.length === 0) {
                this.reset();
                return;
            }
            const largest = values.reduce((p, c) => (p === undefined || c.temp > p.temp ? c : p), undefined);
            if (largest.temp !== this.max) {
                this.max = largest.temp;
                yield this.fire('max', largest.name, this.max);
            }
            const smallest = values.reduce((p, c) => (p === undefined || c.temp < p.temp ? c : p), undefined);
            if (smallest.temp !== this.min) {
                this.min = smallest.temp;
                yield this.fire('min', smallest.name, this.min);
            }
            const sum = values.reduce((s, c) => s + c.temp, 0);
            const avg = Math.round((sum / values.length) * 10) / 10;
            if (this.average !== avg) {
                this.average = avg;
                yield this.fire('avg', sensor, this.average);
            }
        });
    }
}
exports.default = MomentanAverage;


/***/ }),
/* 17 */
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
class PeriodAverage {
    constructor() {
        this.value = undefined;
        this.seconds = undefined;
        this.lastUpdate = undefined;
        this.lastValue = undefined;
        this.minValue = undefined;
        this.maxValue = undefined;
        this.events = { max: undefined, min: undefined };
    }
    reset() {
        this.minValue = this.lastValue;
        this.maxValue = this.lastValue;
        if (this.lastUpdate === undefined) {
            return;
        }
        this.value = 0;
        this.seconds = 0;
        this.lastUpdate = Date.now();
    }
    update(sensor, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.minValue === undefined || value < this.minValue) {
                this.minValue = value;
                yield this.fire('min', sensor, this.minValue);
            }
            if (this.maxValue === undefined || value > this.maxValue) {
                this.maxValue = value;
                yield this.fire('max', sensor, this.maxValue);
            }
            if (this.lastUpdate === undefined || this.lastValue === undefined) {
                this.value = value;
                this.lastValue = value;
                this.lastSensor = sensor;
                this.seconds = 0;
                this.lastUpdate = Date.now();
                return;
            }
            const now = Date.now();
            const delta = now - this.lastUpdate;
            const seconds = Math.round(delta / 1000);
            if (seconds > 1) {
                this.value += this.lastValue * (seconds - 1) + value;
                this.seconds += seconds;
            }
            else if (seconds === 1) {
                this.value += value;
                this.seconds++;
            }
            else {
                // No time has passed, do nothing...
            }
            this.lastSensor = sensor;
            this.lastValue = value;
            this.lastUpdate = now;
        });
    }
    on(event, fun) {
        this.events[event] = fun;
    }
    fire(event, sensor, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== undefined && this.events[event] !== undefined) {
                yield this.events[event](sensor, value);
            }
        });
    }
    get_delayed() {
        if (this.lastValue === undefined || this.value === undefined || this.seconds === undefined) {
            return undefined;
        }
        if (this.seconds === 0) {
            return Math.round(this.lastValue * 100) / 100;
        }
        return Math.round((this.value / this.seconds) * 100) / 100;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lastValue === undefined || this.value === undefined || this.seconds === undefined) {
                return undefined;
            }
            yield this.update(this.lastSensor, this.lastValue);
            if (this.seconds === 0) {
                return Math.round(this.lastValue * 100) / 100;
            }
            return Math.round((this.value / this.seconds) * 100) / 100;
        });
    }
    getState() {
        if (!this.lastUpdate || !this.lastValue || !this.seconds || !this.value) {
            return undefined;
        }
        return {
            lastSensor: this.lastSensor,
            lastUpdate: this.lastUpdate,
            lastValue: this.lastValue,
            maxValue: this.maxValue,
            minValue: this.minValue,
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
        if (state.lastSensor) {
            this.lastSensor = state.lastSensor;
        }
        if (state.maxValue) {
            this.maxValue = state.maxValue;
        }
        if (state.minValue) {
            this.minValue = state.minValue;
        }
    }
}
exports.default = PeriodAverage;


/***/ }),
/* 18 */
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
const LogManager_1 = __webpack_require__(1);
const getTemp = (device) => {
    return device.capabilitiesObj &&
        device.capabilitiesObj.measure_temperature &&
        device.capabilitiesObj.measure_temperature.value
        ? +device.capabilitiesObj.measure_temperature.value
        : undefined;
};
const getHumidity = (device) => {
    return device.capabilitiesObj &&
        device.capabilitiesObj.measure_humidity &&
        device.capabilitiesObj.measure_humidity.value
        ? +device.capabilitiesObj.measure_humidity.value
        : undefined;
};
const getBatery = (device) => {
    return device.capabilitiesObj &&
        device.capabilitiesObj.measure_battery &&
        device.capabilitiesObj.measure_battery.value
        ? +device.capabilitiesObj.measure_battery.value
        : undefined;
};
class Thermometer {
    constructor(zone, device, ignored) {
        this.zone = zone;
        this.id = device.id;
        this.name = device.name;
        this.icon = device.iconObj.url;
        this.temp = getTemp(device);
        this.humidity = getHumidity(device);
        this.battery = getBatery(device);
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
    update_temperature(temp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.temp === temp) {
                return false;
            }
            this.temp = temp;
            yield this.zone.onDeviceUpdated(this);
            return true;
        });
    }
    update_humidity(humidity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.humidity === humidity) {
                return false;
            }
            this.humidity = humidity;
            yield this.zone.onDeviceUpdated(this);
            return true;
        });
    }
    update_battery(level) {
        this.battery = level;
    }
    setIgnored(ignored) {
        if (this.ignored !== ignored) {
            LogManager_1.debug(`Device ignored status changed for ${this.name} to ${ignored}`);
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
    hasHumidity() {
        if (this.ignored) {
            return false;
        }
        return this.humidity !== undefined;
    }
}
exports.Thermometer = Thermometer;


/***/ })
/******/ ]);
});