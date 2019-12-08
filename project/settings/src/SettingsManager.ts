declare var Homey: any

const defaultSettings = {
    "maxTemperature": "22",
    "minTemperature": "18",
    "zoneHints": true,
    "deviceHints": true,
    "settingsHints": true,
};

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
        console.log("Getting settings: ", this.settings);
        return this.settings;
    }
    public async saveSettings(settings) {
        this.settings = settings;
        await Homey.set('settings', settings);
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
    private async  addToList(list, name, value) {
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
