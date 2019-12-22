import { IDeviceType } from './interfaces/IDeviceType';
import { Zone } from './Zone';

export class Thermometer {
  public id: string;
  public name: string;
  public temp: number | undefined;
  private zone: Zone;
  private ignored: boolean;

  constructor(zone: Zone, device: IDeviceType, ignored: boolean) {
    this.zone = zone;
    this.id = device.id;
    this.name = device.name;
    this.temp =
      device.capabilitiesObj &&
      device.capabilitiesObj.measure_temperature &&
      device.capabilitiesObj.measure_temperature.value
        ? +device.capabilitiesObj.measure_temperature.value
        : undefined;
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

  public async update(temp: number): Promise<boolean> {
    if (this.temp === temp) {
      return false;
    }
    this.temp = temp;
    await this.zone.onDeviceUpdated(this);
    return true;
  }

  public setIgnored(ignored: boolean): boolean {
    if (this.ignored !== ignored) {
      console.log(`Device ignored status changed for ${this.name} to ${ignored}`);
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
}
