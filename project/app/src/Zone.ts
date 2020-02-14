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
  public icon: string;
  private triggers: ITriggers;
  private listener: IZoneListener;
  private name: string;
  private id: string;
  private devices: Thermometer[];
  private ignored: boolean;
  private notMonitored: boolean;
  private devicesIgnored: string[];
  private temperature: MetricManager;
  private humidity: MetricManager;

  constructor(
    triggers: ITriggers,
    listener: IZoneListener,
    id: string,
    name: string,
    icon: string,
    ignored: boolean,
    notMonitored: boolean,
    devicesIgnored: string[],
  ) {
    this.triggers = triggers;
    this.listener = listener;
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.devices = [];
    this.ignored = ignored;
    this.notMonitored = notMonitored;
    this.devicesIgnored = devicesIgnored;
    this.temperature = new MetricManager();
    this.humidity = new MetricManager();

    this.temperature.on('currentMax', async (sensor, temperature) => {
      debug(`Maximum temperature of zone ${this.name} was updated to ${temperature}`);
      await this.triggers.MaxTemperatureChanged({
        sensor: name === undefined ? 'unknown' : sensor,
        temperature,
        zone: this.name,
      });
    });
    this.temperature.on('currentMin', async (sensor, temperature) => {
      debug(`Minimum temperature of zone ${this.name} was updated to ${temperature}`);
      await this.triggers.MinTemperatureChanged({
        sensor: name === undefined ? 'unknown' : sensor,
        temperature,
        zone: this.name,
      });
    });
    this.temperature.on('currentAvg', async (sensorName, temperature) => {
      debug(`Temperature of zone ${this.name} was updated by ${sensorName} to ${temperature}`);
      this.listener.onZoneUpdated(this.id);
      await this.triggers.TemperatureChanged({ zone: this.name, temperature });
    });
    this.temperature.on('underMinBound', async (sensorName, temperature) => {
      if (!this.notMonitored) {
        debug(`Temperature of zone ${this.name}: ${temperature} is below ${this.temperature.minBound}`);
        await this.triggers.TooCold({ zone: this.name, temperature });
      }
    });
    this.temperature.on('overMaxBound', async (sensorName, temperature) => {
      if (!this.notMonitored) {
        debug(`Temperature of zone ${this.name}: ${temperature} is above ${this.temperature.maxBound}`);
        await this.triggers.TooWarm({ zone: this.name, temperature });
      }
    });


    this.humidity.on('currentMax', async (sensor, humidity) => {
      debug(`Maximum humidity of zone ${this.name} was updated to ${humidity}`);
      await this.triggers.MaxHumidityChanged({
        humidity,
        sensor: name === undefined ? 'unknown' : sensor,
        zone: this.name,
      });
    });
    this.humidity.on('currentMin', async (sensor, humidity) => {
      debug(`Minimum humidity of zone ${this.name} was updated to ${humidity}`);
      await this.triggers.MinHumidityChanged({
        humidity,
        sensor: name === undefined ? 'unknown' : sensor,
        zone: this.name,
      });
    });
    this.humidity.on('currentAvg', async (sensorName, humidity) => {
      debug(`Humidity of zone ${this.name} was updated by ${sensorName} to ${humidity}`);
      this.listener.onZoneUpdated(this.id);
      await this.triggers.HumidityChanged({ zone: this.name, humidity });
    });
    this.humidity.on('underMinBound', async (sensorName, humidity) => {
      if (!this.notMonitored) {
        debug(`Humidity of zone ${this.name}: ${humidity} is below ${this.humidity.minBound}`);
        await this.triggers.TooDry({ zone: this.name, humidity });
      }
    });
    this.humidity.on('overMaxBound', async (sensorName, humidity) => {
      if (!this.notMonitored) {
        debug(`Humidity of zone ${this.name}: ${humidity} is above ${this.humidity.maxBound}`);
        await this.triggers.TooHumid({ zone: this.name, humidity });
      }
    });    
  }

  public getAllDevices(): Thermometer[] {
    return this.devices;
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
    return this.temperature.period;
  }
  get currentTemp() {
    return this.temperature.current;
  }
  get periodHumidity() {
    return this.humidity.period;
  }
  get currentHumidity() {
    return this.humidity.current;
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
    this.temperature.minBound = settings.minTemperature;
    this.temperature.maxBound = settings.maxTemperature;
    this.humidity.minBound = settings.minHumidity;
    this.humidity.maxBound = settings.maxHumidity;
  }

  public async addDevice(device: IDeviceType): Promise<Thermometer> {
    return await this.addThermometer(new Thermometer(this, device, this.devicesIgnored.includes(device.id)));
  }
  public async addThermometer(thermometer: Thermometer): Promise<Thermometer> {
    log(`Adding device: ${thermometer.name} to zone ${this.name}`);
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
    this.temperature.resetPeriod();
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
      average: this.temperature.getState(),
    };
  }
  public setState(state: IZoneState) {
    if (state.average) {
      this.temperature.setState(state.average);
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
      await this.temperature.update(undefined, []);
      await this.humidity.update(undefined, []);
    } else {
      await this.temperature.update(
        sensor,
        this.devices.filter(d => d.hasTemp()).map(d => ({ name: d.name, temp: d.temp })),
      );
      await this.humidity.update(
        sensor,
        this.devices.filter(d => d.hasHumidity()).map(d => ({ name: d.name, temp: d.humidity })),
      );
    }
  }
}
