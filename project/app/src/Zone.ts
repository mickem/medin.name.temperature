import { IManager } from './interfaces/IManager';
import { Thermometer } from './Thermometer';

export class Zone {
  private manager: IManager;
  private name: string;
  private id: string;
  private devices: Thermometer[];
  private minTemp: number;
  private minSensor: string;
  private maxTemp: number;
  private maxSensor: string;
  private minAllowed: number;
  private maxAllowed: number;
  private current: number;
  private ignored: boolean;
  private notMonitored: boolean;
  private devicesIgnored: string[];

  constructor(manager: IManager, id: string, name: string, ignored: boolean, notMonitored: boolean, devicesIgnored: string[]) {
    this.manager = manager;
    this.id = id;
    this.name = name;
    this.devices = [];
    this.minTemp = undefined;
    this.minSensor = undefined;
    this.maxTemp = undefined;
    this.maxSensor = undefined;
    this.current = undefined;
    this.minAllowed = manager.getMinTemp();
    this.maxAllowed = manager.getMaxTemp();
    this.ignored = ignored;
    this.notMonitored = notMonitored;
    this.devicesIgnored = devicesIgnored;
  }

  public getId(): string {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getTemperature() {
    return this.current;
  }
  public getMin(): number {
    return this.minTemp;
  }
  public getMax(): number {
    return this.maxTemp;
  }


  public async addDevice(device: any) {
    const t = new Thermometer(device, this.devicesIgnored.includes(device.id));
    this.devices.push(t);
    await this.calculateZoneTemp();
    if (t.hasTemp()) {
      this.updateTemp(t.id, t.temp);
    }
  }

  public async removeDevice(id: string) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === id) {
        this.devices.splice(i, 1);
        await this.calculateZoneTemp();
        return;
      }
    }
  }

  public async setIgnored(ignored: boolean) {
    if (this.ignored !== ignored) {
      this.ignored = ignored;
      await this.calculateZoneTemp();
    }
  }
  public setNotMonitored(notMonitored: boolean) {
    this.notMonitored = notMonitored;
  }
  public setDevicesIgnored(devicesIgnored: string[]) {
    this.devicesIgnored = devicesIgnored;
    for (const device of this.devices) {
      device.setIgnored(this.devicesIgnored.includes(device.id));
    }
  }

  public resetMaxMin() {
    this.minTemp = undefined;
    this.maxTemp = undefined;
  }

  public async updateTemp(deviceId: string, temperature: number) {
    if (this.ignored) {
      return;
    }
    const device = this.findDevice(deviceId);
    if (!device) {
      console.error('Failed to find device: ' + deviceId);
      return;
    }
    if (device.update(temperature)) {
      await this.calculateZoneTemp();
    }
    if (this.minTemp === undefined) {
      this.onMinUpdated(device.name, temperature);
    } else {
      const minTemp = Math.min(this.minTemp, temperature);
      if (this.minTemp !== minTemp) {
        this.onMinUpdated(device.name, temperature);
      }
    }
    if (this.maxTemp === undefined) {
      this.onMaxUpdated(device.name, temperature);
    } else {
      const maxTemp = Math.max(this.maxTemp, temperature);
      if (this.maxTemp !== maxTemp) {
        this.onMaxUpdated(device.name, temperature);
      }
    }
  }

  private findDevice(id: string): Thermometer | undefined {
    for (const d of this.devices) {
      if (d.id === id) {
        return d;
      }
    }
    return undefined;
  }

  private async calculateZoneTemp() {
    if (this.ignored) {
      return;
    }
    let avgTemp = 0;
    let count = 0;
    for (const device of this.devices) {
      if (device.hasTemp()) {
        avgTemp += device.temp;
        count++;
      }
    }
    if (count > 0) {
      const newCurrent = Math.round(avgTemp / count * 10) / 10;
      if (newCurrent !== this.current) {
        this.current = newCurrent;
        await this.onTempUpdated();
      }
    } else {
      this.current = undefined;
    }
  }

  private onMaxUpdated(name: string, temperature: number) {
    this.maxTemp = temperature;
    this.maxSensor = name;
    this.manager.getTriggers().onMaxUpdated(this.name, name, this.maxTemp);
  }
  private onMinUpdated(name: string, temperature: number) {
    this.minTemp = temperature;
    this.minSensor = name;
    this.manager.getTriggers().onMinUpdated(this.name, name, this.minTemp);
  }
  private async onTempUpdated() {
    if (this.notMonitored) {
      await this.manager.getTriggers().onTempUpdated(this.name, this.current);
      return;
    }
    if (this.current > this.maxAllowed) {
      this.manager.getTriggers().onTooWarm(this.name, this.current);
    } else if (this.current < this.minAllowed) {
      this.manager.getTriggers().onTooCold(this.name, this.current);
    } else {
      await this.manager.getTriggers().onTempUpdated(this.name, this.current);
    }
  }
}
