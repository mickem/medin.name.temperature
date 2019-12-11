import { IDeviceType } from "./interfaces/IDeviceType";

export class Thermometer {
  public id: string;
  public name: string;
  public temp: number | undefined;
  private device: any;
  private zoneId: string;
  private zone: string;
  private ignored: boolean;

  constructor(device: IDeviceType, ignored: boolean) {
    this.device = device;
    this.id = device.id;
    this.name = device.name;
    this.zoneId = device.zone;
    this.zone = device.zoneName;
    this.temp = device.capabilitiesObj && device.capabilitiesObj.measure_temperature && device.capabilitiesObj.measure_temperature.value ? +device.capabilitiesObj.measure_temperature.value : undefined;
    this.ignored = ignored;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
  }
  public getZone(): string {
    return this.zone;
  }
  public getZoneId(): string {
    return this.zoneId;
  }
  public setZone(zoneId: string, zoneName: string) {
    this.zoneId = zoneId;
    this.zone = zoneName;
  }

  public update(temp: number): boolean {
    if (this.temp === temp) {
      return false;
    }
    this.temp = temp;
    return true;
  }

  public setIgnored(ignored: boolean): boolean {
    const ret = this.ignored !== ignored;
    this.ignored = ignored;
    return true;
  }

  public hasTemp() {
    if (this.ignored) {
      return false;
    }
    return this.temp !== undefined;
  }
}
