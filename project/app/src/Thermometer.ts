import { IDeviceType } from './interfaces/IDeviceType';
import { debug } from './LogManager';
import { Zone } from './Zone';

const getTemp = (device: IDeviceType) => {
  return device.capabilitiesObj &&
    device.capabilitiesObj.measure_temperature &&
    device.capabilitiesObj.measure_temperature.value
    ? +device.capabilitiesObj.measure_temperature.value
    : undefined;
}
const getHumidity = (device: IDeviceType) => {
  return device.capabilitiesObj &&
    device.capabilitiesObj.measure_humidity &&
    device.capabilitiesObj.measure_humidity.value
    ? +device.capabilitiesObj.measure_humidity.value
    : undefined;
}
const getBatery = (device: IDeviceType) => {
  return device.capabilitiesObj &&
    device.capabilitiesObj.measure_battery &&
    device.capabilitiesObj.measure_battery.value
    ? +device.capabilitiesObj.measure_battery.value
    : undefined;
}

export class Thermometer {
  public id: string;
  public name: string;
  public temp: number | undefined;
  public humidity: number | undefined;
  public battery: number | undefined;
  public icon: string;
  private zone: Zone;
  private ignored: boolean;

  constructor(zone: Zone, device: IDeviceType, ignored: boolean) {
    this.zone = zone;
    this.id = device.id;
    this.name = device.name;
    this.icon = device.iconObj.url;
    this.temp = getTemp(device);
    this.humidity = getHumidity(device);
    this.battery = getBatery(device);
    this.ignored = ignored;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
  }
  public getZone(): string {
    return this.zone.getName();
  }
  public getZoneId(): string {
    return this.zone.getId();
  }
  public setZone(zone: Zone) {
    this.zone = zone;
  }

  public async update_temperature(temp: number): Promise<boolean> {
    if (this.temp === temp) {
      return false;
    }
    this.temp = temp;
    await this.zone.onDeviceUpdated(this);
    return true;
  }
  public async update_humidity(humidity: number): Promise<boolean> {
    if (this.humidity === humidity) {
      return false;
    }
    this.humidity = humidity;
    await this.zone.onDeviceUpdated(this);
    return true;
  }
  public update_battery(level: number) {
    this.battery = level;
  }

  public setIgnored(ignored: boolean): boolean {
    if (this.ignored !== ignored) {
      debug(`Device ignored status changed for ${this.name} to ${ignored}`);
      this.ignored = ignored;
      return true;
    }
    return false;
  }

  public hasTemp() {
    if (this.ignored) {
      return false;
    }
    return this.temp !== undefined;
  }
  public hasHumidity() {
    if (this.ignored) {
      return false;
    }
    return this.humidity !== undefined;
  }
}
