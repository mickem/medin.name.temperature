import { IDeviceList, IDeviceType } from './interfaces/IDeviceType';
import { IZoneType, IZoneTypeList } from './interfaces/IZoneType';
import { debug, error, log } from './LogManager';

import { HomeyAPI } from 'athom-api';
import { Zones } from './Zones';

const delay = time => new Promise(res => setTimeout(res, time));

const isThermometer = (device: IDeviceType) => {
  if (device.capabilitiesObj) {
    return 'measure_temperature' in device.capabilitiesObj;
  } else if (device.capabilities) {
    return 'measure_temperature' in device.capabilities;
  }
  error(`Failed to find capabilities list from ${device.name}`);
  return false;
};

export class DeviceManager {
  private api: HomeyAPI;
  private zones: Zones;
  private devicesNotReadyAtStart: string[];

  constructor(api: HomeyAPI, zones: Zones) {
    this.api = api;
    this.zones = zones;
  }

  public async start() {
    this.setupDeviceSubscription();
    this.setupZoneSubscriptions();
    return await Promise.all([this.scanZones(), await this.scanDevices()]);
  }

  private setupDeviceSubscription() {
    (this.api.devices as any).on('device.create', async (device: IDeviceType) => await this.onDeviceCreate(device));
    (this.api.devices as any).on('device.update', async (device: IDeviceType) => await this.onDeviceUpdate(device));
    (this.api.devices as any).on('device.delete', async (device: IDeviceType) => await this.onDeviceDelete(device));
  }

  private async onDeviceCreate(device: IDeviceType) {
    try {
      if (!isThermometer(device)) {
        return;
      }
      const readyDevice = await this.waitForDevice(device, 12);
      if (readyDevice) {
        await this.addDevice(readyDevice as IDeviceType);
      } else {
        error(`Device not ready: ${device.id}`);
      }
    } catch (error) {
      console.error(`Failed to handle device.create: ${error}`);
    }
  }
  private async onDeviceUpdate(device: IDeviceType) {
    try {
      if (!isThermometer(device)) {
        return;
      }
      const d = this.zones.findDevice(device.id);
      if (!d) {
        return;
      }
      if (d && d.getZoneId() !== device.zone) {
        await this.zones.moveDevice(d, d.getZoneId(), device.zone, device.zoneName);
      }
      if (d.name !== device.name) {
        d.setName(device.name);
      }
    } catch (error) {
      console.error(`Failed to handle device.update: ${error}`, error);
    }
  }
  private async onDeviceDelete(device: IDeviceType) {
    try {
      await this.zones.removeDeviceById(device.id);
    } catch (error) {
      console.error(`Failed to handle device.delete: ${error}`);
    }
  }

  private setupZoneSubscriptions() {
    (this.api.zones as any).on('zone.create', async (zone: IZoneType) => await this.onZoneCreate(zone));
    (this.api.zones as any).on('zone.update', async (zone: IZoneType) => await this.onZoneUpdate(zone));
    (this.api.zones as any).on('zone.delete', async (zone: IZoneType) => await this.onZoneDelete(zone));
  }

  private async onZoneCreate(zone: IZoneType) {
    try {
      this.zones.addZone(zone.id, zone.name);
    } catch (error) {
      console.error(`Failed to handle zone.create: ${error}`);
    }
  }
  private async onZoneUpdate(zone: IZoneType) {
    try {
      const z = this.zones.getZoneById(zone.id);
      if (z && z.getName() !== zone.name) {
        z.setName(zone.name);
      }
    } catch (err) {
      error(`Failed to handle zone update of ${zone.name}: ${err}`);
    }
  }
  private async onZoneDelete(zone: IZoneType) {
    try {
      this.zones.removeZone(zone.id);
    } catch (error) {
      error(`Failed to handle delete of zone ${zone.id}: ${error}`);
    }
  }

  private async scanZones() {
    const allZones = await ((this.api.zones.getZones() as any) as Promise<IZoneTypeList>);
    for (const id in allZones) {
      this.zones.addZone(id, allZones[id].name);
    }
    return true;
  }
  private async scanDevices() {
    const allDevices = await ((this.api.devices.getDevices() as any) as Promise<IDeviceList>);
    for (const id in allDevices) {
      if (!isThermometer(allDevices[id])) {
        if (!allDevices[id].ready) {
          log(`Device not ready, skipping: ${allDevices[id]}`);
        }
        continue;
      }
      if (allDevices[id].driverUri === 'homey:app:medin.name.temperatures') {
        debug(`Ignoring my own thermometer: ${allDevices[id].driverUri}`);
        continue;
      }
      const device = await this.waitForDevice(allDevices[id], 12);
      if (device) {
        await this.addDevice(device as IDeviceType);
      }
    }
    return true;
  }

  private async waitForDevice(device: IDeviceType, timeToWait: number): Promise<IDeviceType | boolean> {
    const resultDevice = await ((this.api.devices.getDevice({ id: device.id }) as any) as Promise<IDeviceType>);
    if (resultDevice.ready) {
      return resultDevice;
    }
    await delay(1000);
    if (timeToWait > 0) {
      return await this.waitForDevice(device, timeToWait--);
    } else {
      log(`Found Device, not ready: ${resultDevice.name}`);
      this.devicesNotReadyAtStart.push(resultDevice.name);
      return false;
    }
  }

  private async addDevice(device: IDeviceType) {
    const t = await this.zones.addDevice(device);
    device.makeCapabilityInstance('measure_temperature', async (temperature: any) => {
      await t.update(temperature);
    });
  }
}
