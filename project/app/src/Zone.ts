import Average, { IAverageState } from './helpers/Average';
import { IDeviceType } from './interfaces/IDeviceType';
import { ISettings } from './SettingsManager';
import { Thermometer } from './Thermometer';
import { ITriggers } from './Triggers';
import { Catch } from './utils';

export interface IZoneState {
  minTemp: number;
  maxTemp: number;
  dailyMax?: number;
  dailyMin?: number;
  average?: IAverageState;
}
export interface IZoneListener {
  onZoneUpdated(id: string);
}
export class Zone {
  private triggers: ITriggers;
  private listener: IZoneListener;
  private name: string;
  private id: string;
  private devices: Thermometer[];
  private dailyMinTemp: number;
  private dailyMaxTemp: number;
  private currentMinTemp: number;
  private currentMaxTemp: number;
  private minAllowed: number;
  private maxAllowed: number;
  private current: number;
  private ignored: boolean;
  private notMonitored: boolean;
  private devicesIgnored: string[];
  private avg: Average;

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
    this.dailyMinTemp = undefined;
    this.dailyMaxTemp = undefined;
    this.currentMinTemp = undefined;
    this.currentMaxTemp = undefined;
    this.current = undefined;
    this.ignored = ignored;
    this.notMonitored = notMonitored;
    this.devicesIgnored = devicesIgnored;
    this.avg = new Average();
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
  public getDailyMin(): number {
    return this.dailyMinTemp;
  }
  public getDailyMax(): number {
    return this.dailyMaxTemp;
  }
  public getCurrentMin(): number {
    return this.currentMinTemp;
  }
  public getCurrentMax(): number {
    return this.currentMaxTemp;
  }
  public getAvg(): number {
    return this.avg.get();
  }
  public hasDevice(): boolean {
    return this.devices.length > 0;
  }

  public countDevices(): number {
    return this.devices.length;
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
      console.log(`Zone ignore status changed for ${this.name} to ${ignored}`);
      this.ignored = ignored;
      await this.calculateZoneTemp();
    }
  }
  public setNotMonitored(notMonitored: boolean) {
    if (this.notMonitored !== notMonitored) {
      this.notMonitored = notMonitored;
      console.log(`Zone not-monitored status changed for ${this.name} to ${notMonitored}`);
    }
  }
  public async setDevicesIgnored(devicesIgnored: string[]) {
    this.devicesIgnored = devicesIgnored;
    let hasChanged = false;
    for (const device of this.devices) {
      if (device.setIgnored(this.devicesIgnored.includes(device.id))) {
        hasChanged = true;
      }
    }
    if (hasChanged) {
      await this.calculateZoneTemp();
    }
  }

  public resetMaxMin() {
    this.dailyMinTemp = undefined;
    this.dailyMaxTemp = undefined;
    this.avg.reset();
  }

  @Catch()
  public async onDeviceUpdated(thermometer: Thermometer) {
    if (this.ignored) {
      return;
    }
    if (!(await this.calculateZoneTemp())) {
      return;
    }
    if (this.dailyMinTemp === undefined) {
      await this.onMinUpdated(thermometer.name, thermometer.temp);
    } else {
      const minTemp = Math.min(this.dailyMinTemp, thermometer.temp);
      if (this.dailyMinTemp !== minTemp) {
        await this.onMinUpdated(thermometer.name, thermometer.temp);
      }
    }
    if (this.dailyMaxTemp === undefined) {
      await this.onMaxUpdated(thermometer.name, thermometer.temp);
    } else {
      const maxTemp = Math.max(this.dailyMaxTemp, thermometer.temp);
      if (this.dailyMaxTemp !== maxTemp) {
        await this.onMaxUpdated(thermometer.name, thermometer.temp);
      }
    }
    this.listener.onZoneUpdated(this.id);
  }

  public getState(): IZoneState {
    return {
      average: this.avg.getState(),
      dailyMax: this.dailyMaxTemp,
      dailyMin: this.dailyMinTemp,
      maxTemp: this.dailyMaxTemp,
      minTemp: this.dailyMinTemp,
    };
  }
  public setState(state: IZoneState) {
    this.dailyMaxTemp = state.maxTemp;
    this.dailyMinTemp = state.minTemp;
    if (state.dailyMax) {
      this.dailyMaxTemp = state.dailyMax;
    }
    if (state.dailyMin) {
      this.dailyMinTemp = state.dailyMin;
    }
    if (state.average) {
      this.avg.setState(state.average);
    }
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
    let curMin;
    let curMax;
    if (this.ignored) {
      this.current = undefined;
      return false;
    }
    let avgTemp = 0;
    let count = 0;
    for (const device of this.devices) {
      if (device.hasTemp()) {
        if (curMax === undefined) {
          curMax = device.temp;
        } else if (device.temp > curMax) {
          curMax = device.temp;
        }
        if (curMin === undefined) {
          curMin = device.temp;
        } else if (device.temp < curMin) {
          curMin = device.temp;
        }
        avgTemp += device.temp;
        count++;
      }
    }
    if (count > 0) {
      this.currentMaxTemp = curMax;
      this.currentMinTemp = curMin;
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
    this.dailyMaxTemp = temperature;
    await this.triggers.MaxTemperatureChanged({ zone: this.name, sensor: name, temperature: this.dailyMaxTemp });
  }
  private async onMinUpdated(name: string, temperature: number) {
    this.dailyMinTemp = temperature;
    await this.triggers.MinTemperatureChanged({ zone: this.name, sensor: name, temperature: this.dailyMinTemp });
  }
  private async onTempUpdated() {
    this.avg.update(this.current);
    await this.triggers.TemperatureChanged({ zone: this.name, temperature: this.current });
    if (!this.notMonitored) {
      if (this.current > this.maxAllowed) {
        await this.triggers.TooWarm({ zone: this.name, temperature: this.current });
      } else if (this.current < this.minAllowed) {
        await this.triggers.TooCold({ zone: this.name, temperature: this.current });
      }
    }
  }
}
