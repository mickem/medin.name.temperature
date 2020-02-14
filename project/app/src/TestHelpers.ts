import { IDeviceType } from './interfaces/IDeviceType';
import { ITemperatureManager } from './interfaces/ITemperatureManager';
import { ILogMessage } from './LogManager';
import { ITriggers } from './Triggers';
import { Zone } from './Zone';
import { Zones } from './Zones';

export function makeDevice(
  id = '1234',
  name = 'demo device',
  zoneId = '2345',
  zoneName = 'the zone',
  temp = '23.4',
): IDeviceType {
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
    makeCapabilityInstance(capabilityId: string, listener: any) {},
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
      HumidityChanged(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      TooDry(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      TooHumid(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      MinHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
      MaxHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
    },
    {
      onZoneUpdated() {},
    },
    id,
    name,
    'unknown',
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
      HumidityChanged(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      TooDry(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      TooHumid(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      MinHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
      MaxHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
    },
    {
      onZoneUpdated() {},
    },
  );
}

export function makeDeviceEx(id, name, zoneId, zoneName, temp, battery = 80): IDeviceType {
  return {
    capabilities: ['measure_temperature', 'measure_battery'],
    capabilitiesObj: {
      measure_battery: {
        id: 'n/a',
        value: battery,
      },
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
    makeCapabilityInstance(capabilityId: string, listener: any) {},
  };
}

export class FakeManager implements ITemperatureManager {
  public getLogs(): ILogMessage[] {
    return [];
  }
  public getMinTemp() {
    return 7;
  }
  public getMaxTemp() {
    return 12;
  }
  public getTriggers(): ITriggers {
    return {
      async MaxTemperatureChanged(args) {},
      async MinTemperatureChanged(args) {},

      async TooWarm(args) {},
      async TooCold(args) {},
      async TemperatureChanged(args) {},
      async HumidityChanged(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      async TooDry(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      async TooHumid(args: { zone: string; humidity: number }): Promise<void> {
        return;
      },
      async MinHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
      async MaxHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void> {
        return;
      },
    };
  }
  public getZones() {
    return {};
  }
  public getDevices() {
    return [];
  }
}
