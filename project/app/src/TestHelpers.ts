import { IDeviceType } from './interfaces/IDeviceType';
import { ITemperatureManager } from './interfaces/ITemperatureManager';
import { ITriggers } from './Triggers';
import { Zone } from './Zone';
import { Zones } from './Zones';

export function makeDevice(id = '1234', name = 'demo device', zoneId = '2345', zoneName = 'the zone', temp = '23.4'): IDeviceType {
  return {
    capabilities: [
      'measure_temperature',
    ],
    capabilitiesObj: {
      measure_temperature: {
        id: 'n/a',
        value: temp,
      },
    },
    driverUri: '',
    iconObj: {
      id: 'n/a',
      url: 'n/a',
    },
    id,
    name,
    ready: true,
    zone: zoneId,
    zoneName,
    makeCapabilityInstance(capabilityId: string, listener: any) { },
  };
}
export function makeZone(
  id = '1234',
  name = 'demo device',
  ignored = false,
  notMonitored = false,
  devicesIgnored = [],
) {
  return new Zone(
    {
      MaxTemperatureChanged(): Promise<void> {
        return;
      },
      MinTemperatureChanged(): Promise<void> {
        return;
      },
      TemperatureChanged(): Promise<void> {
        return;
      },
      TooCold(): Promise<void> {
        return;
      },
      TooWarm(): Promise<void> {
        return;
      },
    },
    {
      onZoneUpdated() { },
    },
    id,
    name,
    ignored,
    notMonitored,
    devicesIgnored,
  );
}
export function makeZones() {
  return new Zones(
    {
      MaxTemperatureChanged(): Promise<void> {
        return;
      },
      MinTemperatureChanged(): Promise<void> {
        return;
      },
      TemperatureChanged(): Promise<void> {
        return;
      },
      TooCold(): Promise<void> {
        return;
      },
      TooWarm(): Promise<void> {
        return;
      },
    },
    {
      onZoneUpdated() { },
    },
  );
}

export function makeDeviceEx(id, name, zoneId, zoneName, temp): IDeviceType {
  return {
    capabilities: ['measure_temperature'],
    capabilitiesObj: {
      measure_temperature: {
        id: 'n/a',
        value: temp,
      },
    },
    driverUri: '',
    iconObj: {
      id: 'n/a',
      url: 'n/a',
    },
    id,
    name,
    ready: true,
    zone: zoneId,
    zoneName,
    makeCapabilityInstance(capabilityId: string, listener: any) { },
  };
}

export class FakeManager implements ITemperatureManager {
  public getMinTemp() {
    return 7;
  }
  public getMaxTemp() {
    return 12;
  }
  public getTriggers(): ITriggers {
    return {
      async MaxTemperatureChanged(args) { },
      async MinTemperatureChanged(args) { },

      async TooWarm(args) { },
      async TooCold(args) { },
      async TemperatureChanged(args) { },
    };
  }
  public getZones() {
    return {};
  }
  public async getDevices() {
    return {};
  }
}
