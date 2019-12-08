import { IManager } from "./interfaces/IManager";
import { Zone } from "./Zone";

export interface IZoneList {
    [key: string]: Zone;
}

export class Zones {
    private zones: IZoneList;
    private manager: IManager;
    private zonesIgnored: string[];
    private zonesNotMonitored: string[];
    private devicesIgnored: string[];

    constructor(manager: IManager) {
        this.manager = manager;
        this.zones = {}
        this.zonesIgnored = [];
        this.zonesNotMonitored = [];
        this.devicesIgnored = [];
    }

    public addZone(id: string, name: string): Zone {
        if (id in this.zones) {
            return this.zones[id];
        }
        const zone = new Zone(this.manager, id, name, this.zonesIgnored.includes(id), this.zonesNotMonitored.includes(id), this.devicesIgnored);
        this.zones[id] = zone;
        return zone;
    }

    public async removeDeviceById(id: string) {
        for (const key in this.zones) {
            await this.zones[key].removeDevice(id);
        }
    }

    public getAll(): IZoneList {
        return this.zones;
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