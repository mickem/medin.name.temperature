(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("homey"));
	else if(typeof define === 'function' && define.amd)
		define(["homey"], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory(require("homey"));
	else
		root["library"] = factory(root["homey"]);
})(global, function(__WEBPACK_EXTERNAL_MODULE__0__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),

/***/ 1:
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

/***/ 2:
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

/***/ 23:
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
const CapabilityWrapper_1 = __webpack_require__(24);
const DriverImpl_1 = __webpack_require__(4);
class ZoneTemperatue extends homey_1.Device {
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.getMyData().id || 'none';
            LogManager_1.log(`Adding device for ${id}`);
            this.max = new CapabilityWrapper_1.CapabilityWrapper(this, DriverImpl_1.capabilities.max);
            this.min = new CapabilityWrapper_1.CapabilityWrapper(this, DriverImpl_1.capabilities.min);
            this.cur = new CapabilityWrapper_1.CapabilityWrapper(this, DriverImpl_1.capabilities.temp);
            homey_1.app.get().subscribeToZone(id, () => __awaiter(this, void 0, void 0, function* () {
                const z = this.getTM().getZones()[id];
                if (!z) {
                    LogManager_1.log(`No device found for ${id}`);
                    return;
                }
                yield this.max.set(z.periodTemp.maxValue);
                yield this.min.set(z.periodTemp.minValue);
                yield this.cur.set(yield z.getDailyAvg());
            }));
        });
    }
    getMyData() {
        return this.getData();
    }
    getTM() {
        return homey_1.app.get();
    }
}
__decorate([
    utils_1.Catch(true)
], ZoneTemperatue.prototype, "onInit", null);
module.exports = ZoneTemperatue;


/***/ }),

/***/ 24:
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
class CapabilityWrapper {
    constructor(handler, name) {
        this.handler = handler;
        this.name = name;
    }
    set(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (value === undefined) {
                    return;
                }
                if (this.lastValue === undefined || this.lastValue !== value) {
                    this.lastValue = value;
                    LogManager_1.debug(`Updating ${this.name} to ${value}`);
                    yield this.handler.setCapabilityValue(this.name, value);
                }
            }
            catch (error) {
                error(`Failed to update ${this.name}: ${error}`, error);
            }
        });
    }
    setOptions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handler.setCapabilityOptions(this.name, data);
        });
    }
}
exports.CapabilityWrapper = CapabilityWrapper;


/***/ }),

/***/ 4:
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
exports.capabilities = {
    /**
     * Maximum temperature
     */
    max: 'measure_temperature.max',
    /**
     * Minimum temperature
     */
    min: 'measure_temperature.min',
    /**
     * Average temperature
     */
    temp: 'measure_temperature',
};
/**
 * Virtual thermometer for daily averages.
 * #class:sensor
 */
class ZoneTemperatureDriver extends homey_1.Driver {
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.info(`Initializing driver`);
        });
    }
    onPair(socket) {
        const devices = Object.values(this.getTM().getZones()).map(z => ({
            data: { id: z.getId() },
            name: `${z.getName()} daily average`,
        }));
        socket.on('list_devices', (data, callback) => {
            socket.emit('list_devices', devices);
            callback(null, devices);
            // callback( new Error('Something bad has occured!') );
        });
    }
    onPairListDevices(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            callback(null, [
                {
                    capabilities: exports.capabilities,
                    name: 'Device.pair',
                },
            ]);
        });
    }
    getTM() {
        return homey_1.app.get();
    }
}
exports.ZoneTemperatureDriver = ZoneTemperatureDriver;


/***/ })

/******/ });
});