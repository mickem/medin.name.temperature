declare var Homey: any

const defaultSettings = {
    "maxTemperature": "22",
    "minTemperature": "18",
    "zoneHints": true,
    "deviceHints": true,
    "settingsHints": true,
    dailyReset: "02:00",
};

function parseTime(time, format, step) {
	
	var hour, minute, stepMinute,
		defaultFormat = 'g:ia',
		pm = time.match(/p/i) !== null,
		num = time.replace(/[^0-9]/g, '');
	
	// Parse for hour and minute
	switch(num.length) {
		case 4:
			hour = parseInt(num[0] + num[1], 10);
			minute = parseInt(num[2] + num[3], 10);
			break;
		case 3:
			hour = parseInt(num[0], 10);
			minute = parseInt(num[1] + num[2], 10);
			break;
		case 2:
		case 1:
			hour = parseInt(num[0] + (num[1] || ''), 10);
			minute = 0;
			break;
		default:
			return '';
	}
	
	// Make sure hour is in 24 hour format
	if( pm === true && hour > 0 && hour < 12 ) hour += 12;
	
	// Force pm for hours between 13:00 and 23:00
	if( hour >= 13 && hour <= 23 ) pm = true;
	
	// Handle step
	if( step ) {
		// Step to the nearest hour requires 60, not 0
		if( step === 0 ) step = 60;
		// Round to nearest step
		stepMinute = (Math.round(minute / step) * step) % 60;
		// Do we need to round the hour up?
		if( stepMinute === 0 && minute >= 30 ) {
			hour++;
			// Do we need to switch am/pm?
			if( hour === 12 || hour === 24 ) pm = !pm;
		}
		minute = stepMinute;
	}
	
	// Keep within range
	if( hour <= 0 || hour >= 24 ) hour = 0;
	if( minute < 0 || minute > 59 ) minute = 0;

	// Format output
	return (format || defaultFormat)
		// 12 hour without leading 0
        .replace(/g/g, hour === 0 ? '12' : 'g')
		.replace(/g/g, hour > 12 ? hour - 12 : hour)
		// 24 hour without leading 0
		.replace(/G/g, hour)
		// 12 hour with leading 0
		.replace(/h/g, hour.toString().length > 1 ? (hour > 12 ? hour - 12 : hour) : '0' + (hour > 12 ? hour - 12 : hour))
		// 24 hour with leading 0
		.replace(/H/g, hour.toString().length > 1 ? hour : '0' + hour)
		// minutes with leading zero
		.replace(/i/g, minute.toString().length > 1 ? minute : '0' + minute)
		// simulate seconds
		.replace(/s/g, '00')
		// lowercase am/pm
		.replace(/a/g, pm ? 'pm' : 'am')
		// lowercase am/pm
		.replace(/A/g, pm ? 'PM' : 'AM');
}

export default class SettingsManager {
    private devicesIgnored: [];
    private devices: [];
    private zones: [];
    private zonesIgnored: [];
    private zonesNotMonitored: [];
    private settings;

    constructor() {
        this.devices = [];
        this.zones = [];
        this.settings = defaultSettings;
        this.devicesIgnored = [];
        this.zonesIgnored = [];
        this.zonesNotMonitored = [];
    }

    public resetSettings(): Promise<void[]> {
        this.settings = defaultSettings;
        this.devicesIgnored = [];
        this.zonesIgnored = [];
        this.zonesNotMonitored = [];
        return Promise.all([
            Homey.set('settings', this.settings),
            Homey.set('zonesNotMonitored', this.zonesNotMonitored),
            Homey.set('devicesIgnored', this.devicesIgnored),
            Homey.set('zonesIgnored', this.zonesIgnored),
        ])
    }
    public reload(): Promise<void[]> {
        return Promise.all([
            this.fetchSettings('zonesNotMonitored', (result) => {
                this.zonesNotMonitored = result;
            }),
            this.fetchSettings('devicesIgnored', (result) => {
                this.devicesIgnored = result;
            }),
            this.fetchSettings('zonesIgnored', (result) => {
                this.zonesIgnored = result;
            }),
            this.fetchSettings('settings', (result) => {
                if (result !== (null || undefined)) {
                    this.settings = result;
                }
            }),
            this.reloadZones(),
            this.reloadDevices(),
        ])
    }
    public getZones() {
        return this.zones;
    };
    public getDevices() {
        return this.devices;
    }
    public getSettings() {
        return this.settings;
    }
    public async saveSettings(settings) {
        const newSettings = {
            ...this.settings,
            ...settings
        };
        await Homey.set('settings', newSettings);
        this.settings = newSettings;
    }
    public getDevicesIgnored() {
        return this.devicesIgnored;
    }
    public getZonesIgnored() {
        return this.zonesIgnored;
    }
    public getZonesNotMonitored() {
        return this.zonesNotMonitored;
    }
    public async addZoneMonitored(zone) {
        this.zonesNotMonitored = await this.removeFromList(this.zonesNotMonitored, 'zonesNotMonitored', zone.id);
        this.zonesIgnored = await this.removeFromList(this.zonesIgnored, 'zonesIgnored', zone.id);
    }
    public async addZoneEnabled(zone) {
        this.zonesNotMonitored = await this.addToList(this.zonesNotMonitored, 'zonesNotMonitored', zone.id);
        this.zonesIgnored = await this.removeFromList(this.zonesIgnored, 'zonesIgnored', zone.id);
    }
    public async addZoneDisabled(zone) {
        this.zonesIgnored = await this.addToList(this.zonesIgnored, 'zonesIgnored', zone.id);
        this.zonesNotMonitored = await this.addToList(this.zonesNotMonitored, 'zonesNotMonitored', zone.id);
    }
    public async addDeviceIgnored(device) {
        this.devicesIgnored = await this.addToList(this.devicesIgnored, 'devicesIgnored', device.id);
    }
    public async removeDeviceIgnored(device) {
        this.devicesIgnored = await this.removeFromList(this.devicesIgnored, 'devicesIgnored', device.id);
    }

    public getDailyReset() {
        return this.settings.dailyReset;
    }
    public setDailyReset(value: string) {
        return parseTime(value, "G:i", undefined);
    }

    public error(error) {
        Homey.alert(error);
    }

    private async removeFromList(list, name, value) {
        const i = list.indexOf(value);
        if (i !== -1) {
            list.splice(i, 1);
            await Homey.set(name, list, (err, result) => {
                if (err) {
                    return Homey.alert(err);
                }
            });
        }
        return list;
    }
    private async addToList(list, name, value) {
        if (list.indexOf(value) === -1) {
            list.push(value);
            await Homey.set(name, list, (err, result) => {
                if (err) {
                    return Homey.alert(err);
                }
            });
        }
        return list;
    }

    private async reloadZones(): Promise<void> {
        return new Promise((resolve, reject) => {
            Homey.api('GET', '/zones', null, (err, result) => {
                if (err) {
                    Homey.alert('getZones' + err);
                    return reject();
                }
                this.zones = result;
                resolve();
            })
        });
    }
    private async reloadDevices(): Promise<void> {
        return new Promise((resolve, reject) => {
            Homey.api('GET', '/devices', null, (err, result) => {
                if (err) {
                    Homey.alert('getDevices' + err);
                    return reject();
                }
                this.devices = result;
                resolve();
            })
        });
    }

    private fetchSettings(key: string, cb: any): Promise<void> {
        return new Promise((resolve, reject) => {
            Homey.get(key, (err, result) => {
                if (err) {
                    reject(err);
                } else if (result) {
                    cb(result);
                    resolve();
                }
            });
        })
    }
}
