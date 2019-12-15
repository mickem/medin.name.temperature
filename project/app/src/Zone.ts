import { IDeviceType } from './interfaces/IDeviceType';
import { ISettings } from './SettingsManager';
import { Thermometer } from './Thermometer';
import { ITriggers } from './Triggers';
import { Catch } from './utils';

export interface IZoneState {
  minTemp: number;
  minSensor: string;
  maxTemp: number;
  maxSensor: string;
}
export interface IZoneListener {
  onZoneUpdated();
}
export class Zone {
  private triggers: ITriggers;
  private listener: IZoneListener;
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

  constructor(
    triggers: ITriggers,
    listener: IZoneListener,
    id: string,
    name: string,
    ignored: boolean,
    notMonitored: boolean,
    devicesIgnored: string[],
  ) {
    this.triggers = triggers;
    this.listener = listener;
    this.id = id;
    this.name = name;
    this.devices = [];
    this.minTemp = undefined;
    this.minSensor = undefined;
    this.maxTemp = undefined;
    this.maxSensor = undefined;
    this.current = undefined;
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
  public hasDevice(): boolean {
    return this.devices.length > 0;
  }

  public onUpdateSettings(settings: ISettings) {
    this.minAllowed = settings.minTemperature;
    this.maxAllowed = settings.maxTemperature;
  }

  public async addDevice(device: IDeviceType): Promise<Thermometer> {
    return await this.addThermometer(new Thermometer(this, device, this.devicesIgnored.includes(device.id)));
  }
  public async addThermometer(thermometer: Thermometer): Promise<Thermometer> {
    thermometer.setZone(this);
    this.devices.push(thermometer);
    if (thermometer.hasTemp()) {
      await this.onDeviceUpdated(thermometer);
    }
    return thermometer;
  }

  public async removeDevice(id: string) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === id) {
        this.devices.splice(i, 1);
        console.log(
          `Removing ${id} from ${this.name} yielded: `,
          this.devices.map(t => t.id),
        );
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

  @Catch()
  public async onDeviceUpdated(thermometer: Thermometer) {
    if (this.ignored) {
      return;
    }
    if (!(await this.calculateZoneTemp())) {
      return;
    }
    if (this.minTemp === undefined) {
      await this.onMinUpdated(thermometer.name, thermometer.temp);
    } else {
      const minTemp = Math.min(this.minTemp, thermometer.temp);
      if (this.minTemp !== minTemp) {
        await this.onMinUpdated(thermometer.name, thermometer.temp);
      }
    }
    if (this.maxTemp === undefined) {
      await this.onMaxUpdated(thermometer.name, thermometer.temp);
    } else {
      const maxTemp = Math.max(this.maxTemp, thermometer.temp);
      if (this.maxTemp !== maxTemp) {
        await this.onMaxUpdated(thermometer.name, thermometer.temp);
      }
    }
    this.listener.onZoneUpdated();
  }

  public getState(): IZoneState {
    return {
      maxSensor: this.maxSensor,
      maxTemp: this.maxTemp,
      minSensor: this.minSensor,
      minTemp: this.minTemp,
    };
  }
  public setState(state: IZoneState) {
    this.maxSensor = state.maxSensor;
    this.maxTemp = state.maxTemp;
    this.minSensor = state.minSensor;
    this.minTemp = state.minTemp;
  }

  public findDevice(id: string): Thermometer | undefined {
    for (const d of this.devices) {
      if (d.id === id) {
        return d;
      }
    }
    return undefined;
  }

  private async calculateZoneTemp(): Promise<boolean> {
    if (this.ignored) {
      this.current = undefined;
      return false;
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
      const newCurrent = Math.round((avgTemp / count) * 10) / 10;
      if (newCurrent !== this.current) {
        this.current = newCurrent;
        await this.onTempUpdated();
        return true;
      }
    } else {
      if (this.current) {
        this.current = undefined;
        return true;
      }
    }
    return false;
  }

  private async onMaxUpdated(name: string, temperature: number) {
    this.maxTemp = temperature;
    this.maxSensor = name;
    await this.triggers.onMaxTemperatureChanged(this.name, name, this.maxTemp);
  }
  private async onMinUpdated(name: string, temperature: number) {
    this.minTemp = temperature;
    this.minSensor = name;
    await this.triggers.onMinTemperatureChanged(this.name, name, this.minTemp);
  }
  private async onTempUpdated() {
    if (!this.notMonitored) {
      await this.triggers.onTemperatureChanged(this.name, this.current);
    }
    if (this.current > this.maxAllowed) {
      await this.triggers.onTooWarm(this.name, this.current);
    } else if (this.current < this.minAllowed) {
      await this.triggers.onTooCold(this.name, this.current);
    } else {
      await this.triggers.onTemperatureChanged(this.name, this.current);
    }
  }
}
