import { IManager } from './interfaces/IManager';
import { Triggers } from "./Triggers";

export function makeDevice(id = "1234", name = "demo device", zoneId = "2345", zoneName = "the zone", temp = "23.4") {
    return {
        capabilitiesObj: {
            measure_temperature: {
                id: "n/a",
                value: temp,
            }
        },
        iconObj: {
            id: "n/a",
            url: "n/a",
        },
        id,
        name,
        ready: true,
        zone: zoneId,
        zoneName,
    }
}

export function makeDeviceEx(id, name, zoneId, zoneName, temp) {
    return {
        capabilitiesObj: {
            measure_temperature: {
                id: "n/a",
                value: temp,
            }
        },
        iconObj: {
            id: "n/a",
            url: "n/a",
        },
        id,
        name,
        ready: true,
        zone: zoneId,
        zoneName,
    }
}




export class FakeManager implements IManager {
    public getMinTemp() {
        return 7;
    }
    public getMaxTemp() {
        return 12;
    }
    public getTriggers() {
        return ({
            register() { },
            enable() { },
            disable() { },


            async onMaxUpdated(zone: string, device: string, temp: number) { },
            async onMinUpdated(zone: string, device: string, temp: number) { },

            async onTooWarm(zone: string, temp: number) { },
            async onTooCold(zone: string, temp: number) { },
            async onTempUpdated(zone: string, temp: number) { },
        } as any as Triggers);
    }
    public getZones() {
        return {};
    }
    public async getDevices() {
        return {}
    }
    public onZoneUpdated() {
    }
};
