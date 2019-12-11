import { IManager } from "./interfaces/IManager";
import { Zone } from "./Zone";
import { Thermometer } from "./Thermometer";

export interface IZoneList {
    [key: string]: Zone;
}
export interface IZonesState {
    [key: string]: IZonesState;
}

export class Zones {

    private zones: IZoneList;
    private manager: IManager;
    private zonesIgnored: string[];
    private zonesNotMonitored: string[];
    private devicesIgnored: string[];
    private state: any;

    constructor(manager: IManager) {
        this.manager = manager;
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
        const zone = new Zone(this.manager, id, name, this.zonesIgnored.includes(id), this.zonesNotMonitored.includes(id), this.devicesIgnored);
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
        thermometer.setZone(newZone.getId(), newZone.getName());
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