import { IDeviceType } from "./interfaces/IDeviceType";
import { IManager } from "./interfaces/IManager";
import { ISettings } from "./SettingsManager";
import { ITriggers } from "./Triggers";
import { Thermometer } from "./Thermometer";
import { Zone, IZoneListener } from "./Zone";

export interface IZoneList {
    [key: string]: Zone;
}
export interface IZonesState {
    [key: string]: IZonesState;
}

export class Zones {
    private zones: IZoneList;
    private triggerManager: ITriggers;
    private listener: IZoneListener;
    private zonesIgnored: string[];
    private zonesNotMonitored: string[];
    private devicesIgnored: string[];
    private state: any;
    private settings: ISettings;

    constructor(triggerManager: ITriggers, listener: IZoneListener) {
        this.triggerManager = triggerManager;
        this.listener = listener;
        this.zones = {}
        this.zonesIgnored = [];
        this.zonesNotMonitored = [];
        this.devicesIgnored = [];
    }

    public resetMaxMin() {
        for (const key in this.zones) {
            this.zones[key].resetMaxMin();
        }
    }

    public addZone(id: string, name: string): Zone {
        if (id in this.zones) {
            return this.zones[id];
        }
        const zone = new Zone(this.triggerManager, this.listener, id, name, this.zonesIgnored.includes(id), this.zonesNotMonitored.includes(id), this.devicesIgnored);
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
    public getZoneById(id: any): Zone | undefined {
        if (id in this.zones) {
            return this.zones[id];
        }
    }
    public removeZone(id: string) {
        const zone = this.getZoneById(id);
        if (zone) {
            delete this.zones[id];
        }
    }

    public async addDevice(device: IDeviceType): Promise<Thermometer> {
        const zone = this.addZone(device.zone, device.zoneName);
        return await zone.addDevice(device);
    }

    public async removeDeviceById(id: string) {
        for (const key in this.zones) {
            await this.zones[key].removeDevice(id);
        }
    }
    public findDevice(id: string): Thermometer | undefined {
        for (const key in this.zones) {
            const d = this.zones[key].findDevice(id);
            if (d) {
                return d;
            }
        }
        return undefined;
    }
    public async moveDevice(thermometer: Thermometer, oldZoneId: string, newZoneId: string, zoneName: string) {
        const newZone = this.addZone(newZoneId, zoneName || "unknown");
        const oldZone = this.addZone(oldZoneId, "unknown");
        console.log(`Moving thermometer from ${oldZone.getName()} to ${newZone.getName()}`);
        await newZone.addThermometer(thermometer);
        await oldZone.removeDevice(thermometer.id);
        thermometer.setZone(newZone);
    }

    public getAll(): IZoneList {
        return this.zones;
    }

    public getState(): IZonesState {
        const state = {}
        for (const key in this.zones) {
            state[key] = this.zones[key].getState();
        }
        return state;
    }
    public setState(state: IZonesState) {
        this.state = state;
    }

    public onUpdateSettings(settings: ISettings) {
        this.settings = settings;
        for (const key in this.zones) {
            this.zones[key].onUpdateSettings(settings);
        }
    }

    public async updateDevices(zonesIgnored: string[], zonesNotMonitored: string[], devicesIgnored: string[]) {
        if (this.zonesIgnored !== zonesIgnored) {
            this.zonesIgnored = zonesIgnored;
            for (const key in this.zones) {
                await this.zones[key].setIgnored(this.zonesIgnored.includes(key));
            }
        }
        if (this.zonesNotMonitored !== zonesNotMonitored) {
            this.zonesNotMonitored = zonesNotMonitored;
            for (const key in this.zones) {
                await this.zones[key].setNotMonitored(this.zonesNotMonitored.includes(key));
            }
        }
        if (this.devicesIgnored !== devicesIgnored) {
            this.devicesIgnored = devicesIgnored;
            for (const key in this.zones) {
                await this.zones[key].setDevicesIgnored(this.devicesIgnored);
            }
        }
    }


}