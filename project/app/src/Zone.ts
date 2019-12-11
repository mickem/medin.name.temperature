import { IDeviceType } from './interfaces/IDeviceType';
import { IManager } from './interfaces/IManager';
import { Thermometer } from './Thermometer';

export interface IZoneState {
  minTemp: number;
  minSensor: string;
  maxTemp: number;
  maxSensor: string;
}
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

  public getName(): string {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
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
  public getDeviceById(id: string): Thermometer | undefined {
    for (const device of this.devices) {
      if (device.id === id) {
        return device;
      }
    }
    return undefined;
  }
  public hasDevice(): boolean {
    return this.devices.length > 0;
  }


  public async addDevice(device: IDeviceType): Promise<Thermometer> {
    return await this.addThermometer(new Thermometer(device, this.devicesIgnored.includes(device.id)));
  }
  public async addThermometer(thermometer: Thermometer): Promise<Thermometer> {
    this.devices.push(thermometer);
    await this.calculateZoneTemp();
    if (thermometer.hasTemp()) {
      this.updateTemp(thermometer.id, thermometer.temp);
    }
    return thermometer;
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
  public async setDevicesIgnored(devicesIgnored: string[]) {
    this.devicesIgnored = devicesIgnored;
    let hasChanged = false;
    for (const device of this.devices) {
      if (device.setIgnored(this.devicesIgnored.includes(device.id))) {
        hasChanged = true;
      }
    }
    await this.calculateZoneTemp();
  }

  public resetMaxMin() {
    this.minTemp = undefined;
    this.maxTemp = undefined;
  }

  public async updateTemp(deviceId: string, temperature: number) {
    if (this.ignored) {
      const device = this.findDevice(deviceId);
      if (!device) {
        console.error('Failed to find device: ' + deviceId);
        return;
      }
      device.update(temperature);
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
    this.manager.onZoneUpdated();
  }

  public getState(): IZoneState {
    return {
      maxSensor: this.maxSensor,
      maxTemp: this.maxTemp,
      minSensor: this.minSensor,
      minTemp: this.minTemp,
    }
  }
  public setState(state: IZoneState) {
    this.maxSensor = state.maxSensor;
    this.maxTemp = state.maxTemp;
    this.minSensor = state.minSensor;
    this.minTemp = state.minTemp;
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
      this.current = undefined;
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
