import MetricManager from './helpers/MetricManager';
import { IAverageState } from './helpers/PeriodAverage';
import { IDeviceType } from './interfaces/IDeviceType';
import { debug, log } from './LogManager';
import { ISettings } from './SettingsManager';
import { Thermometer } from './Thermometer';
import { ITriggers } from './Triggers';
import { Catch } from './utils';

export interface IZoneState {
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
  private minAllowed: number;
  private maxAllowed: number;
  private ignored: boolean;
  private notMonitored: boolean;
  private devicesIgnored: string[];
  private metric: MetricManager;

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
    this.ignored = ignored;
    this.notMonitored = notMonitored;
    this.devicesIgnored = devicesIgnored;
    this.metric = new MetricManager();

    this.metric.on('currentMax', async (sensor, temperature) => {
      debug(`Maximum temperature of zone ${this.name} was updated to ${temperature}`);
      await this.triggers.MaxTemperatureChanged({
        zone: this.name,
        sensor: name === undefined ? 'unknown' : sensor,
        temperature,
      });
    });
    this.metric.on('currentMin', async (sensor, temperature) => {
      debug(`Minimum temperature of zone ${this.name} was updated to ${temperature}`);
      await this.triggers.MinTemperatureChanged({
        zone: this.name,
        sensor: name === undefined ? 'unknown' : sensor,
        temperature,
      });
    });
    this.metric.on('currentAvg', async (sensorName, temperature) => {
      debug(`Temperature of zone ${this.name} was updated by ${sensorName} to ${temperature}`);
      this.listener.onZoneUpdated(this.id);
      await this.triggers.TemperatureChanged({ zone: this.name, temperature });
      if (!this.notMonitored) {
        if (temperature > this.maxAllowed) {
          await this.triggers.TooWarm({ zone: this.name, temperature });
        } else if (temperature < this.minAllowed) {
          await this.triggers.TooCold({ zone: this.name, temperature });
        }
      }
    });
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

  get periodTemp() {
    return this.metric.period;
  }
  get currentTemp() {
    return this.metric.current;
  }
  public async getDailyAvg(): Promise<number> {
    return this.periodTemp.get();
  }
  public getCurrentAvg() {
    return this.currentTemp.average;
  }
  public hasDevice(): boolean {
    return this.devices.length > 0;
  }

  public countDevices(): number {
    return this.devices.length;
  }

  public onUpdateSettings(settings: ISettings) {
    debug(`Setting changed for zone ${this.name}`);
    this.minAllowed = settings.minTemperature;
    this.maxAllowed = settings.maxTemperature;
  }

  public async addDevice(device: IDeviceType): Promise<Thermometer> {
    return await this.addThermometer(new Thermometer(this, device, this.devicesIgnored.includes(device.id)));
  }
  public async addThermometer(thermometer: Thermometer): Promise<Thermometer> {
    log(`Adding thermometer: ${thermometer.name} to zone ${this.name}`);
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
        log(`Removing thermometer: ${this.devices.map(t => t.name)} from zone ${this.name}`);
        await this.calculateZoneTemp(undefined);
        return;
      }
    }
  }

  public async setIgnored(ignored: boolean) {
    if (this.ignored !== ignored) {
      log(`Zone ignore status changed for ${this.name} to ${ignored}`);
      this.ignored = ignored;
      await this.calculateZoneTemp(undefined);
    }
  }
  public setNotMonitored(notMonitored: boolean) {
    if (this.notMonitored !== notMonitored) {
      this.notMonitored = notMonitored;
      log(`Zone not-monitored status changed for ${this.name} to ${notMonitored}`);
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
      await this.calculateZoneTemp(undefined);
    }
  }

  public resetMaxMin() {
    log(`Resetting daily averages for ${this.name}`);
    this.metric.resetPeriod();
  }

  @Catch()
  public async onDeviceUpdated(thermometer: Thermometer) {
    if (this.ignored) {
      debug(`Device of ignored zone ${this.name} updated`);
      return;
    }
    await this.calculateZoneTemp(thermometer.getName());
  }

  public getState(): IZoneState {
    return {
      average: this.metric.getState(),
    };
  }
  public setState(state: IZoneState) {
    if (state.average) {
      this.metric.setState(state.average);
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

  private async calculateZoneTemp(sensor: string) {
    if (this.ignored) {
      await this.metric.update(undefined, []);
    } else {
      await this.metric.update(
        sensor,
        this.devices.filter(d => d.hasTemp()).map(d => ({ name: d.name, temp: d.temp })),
      );
    }
  }
}
