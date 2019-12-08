export class Thermometer {
  public id: string;
  public name: string;
  public temp: number | undefined;
  private device: any;
  private zone: string;
  private ignored: boolean;

  constructor(device: any, ignored: boolean) {
    this.device = device;
    this.id = device.id;
    this.name = device.name;
    this.zone = device.ZoneName;
    this.temp = device.capabilitiesObj.measure_temperature.value;
    this.ignored = ignored;
  }

  public getName(): string {
    return this.name;
  }
  public getZone(): string {
    return this.zone;
  }

  public update(temp: number): boolean {
    if (this.temp === temp) {
      return false;
    }
    this.temp = temp;
    return true;
  }

  public setIgnored(ignored: boolean) {
    this.ignored = ignored;
  }

  public hasTemp() {
    if (this.ignored) {
      return false;
    }
    return this.temp !== undefined;
  }
}
