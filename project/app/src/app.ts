import { HomeyAPI } from 'athom-api';
import Homey from 'homey';
import { Actions } from './Actions';
import { IDeviceList, IDeviceType } from './interfaces/IDeviceType';
import { IManager } from './interfaces/IManager';
import { Triggers } from './Triggers';
import { IZoneList, Zones } from './Zones';

const delay = time => new Promise(res => setTimeout(res, time));


interface ISettings {
  minTemperature: number;
  maxTemperature: number;
  dailyReset: string;
}
const defaultSettings: ISettings = {
  dailyReset: '02:00',
  maxTemperature: 22,
  minTemperature: 18,
};
const devicesNotReadyAtStart = [];
let settings = {
  dailyReset: defaultSettings.dailyReset,
  maxTemperature: defaultSettings.maxTemperature,
  minTemperature: defaultSettings.minTemperature,
};

class TempManager extends Homey.App implements IManager {
  private api: HomeyAPI | undefined;
  private triggers: Triggers;
  private actions: Actions;
  private zones: Zones;
  private zonesIgnored: string[];
  private zonesNotMonitored: string[];
  private devicesIgnored: string[];
  private task: any;

  constructor(path: string) {
    super(path);
    this.api = undefined;
    this.triggers = new Triggers();
    this.zones = new Zones(this);
    this.actions = new Actions({
      setMaxTemperature(temperature: number) { },
      setMinTemperature(temperature: number) { }
    });
  }

  public async onInit() {
    this.getApi();
    const s = Homey.ManagerSettings.get('settings') || (defaultSettings as ISettings);
    settings.minTemperature = s.minTemperature || defaultSettings.minTemperature;
    settings.maxTemperature = s.maxTemperature || defaultSettings.maxTemperature;
    settings.dailyReset = s.dailyReset || defaultSettings.dailyReset;
    console.log(`Allowed temperature span: ${settings.minTemperature} - ${settings.maxTemperature}`);
    this.zonesIgnored = Homey.ManagerSettings.get('zonesIgnored') || [];
    this.zonesNotMonitored = Homey.ManagerSettings.get('zonesNotMonitored') || [];
    this.devicesIgnored = Homey.ManagerSettings.get('devicesIgnored') || [];
    await this.zones.updateDevices(this.zonesIgnored, this.zonesNotMonitored, this.devicesIgnored);
    console.log(`Config: ${this.zonesIgnored}, ${this.zonesNotMonitored}, ${this.devicesIgnored}`);


    await this.installTasks();

    (Homey.ManagerSettings as any).on('set', async (variable: string) => {
      if (variable === 'settings') {
        settings = Homey.ManagerSettings.get('settings') as ISettings;
        console.log(`Allowed temperature span: ${settings.minTemperature} - ${settings.maxTemperature}`);
        console.log(`Reset max/min running at: ${settings.dailyReset}`);
        await this.installTasks();
      } else if (variable === 'zonesIgnored') {
        this.zonesIgnored = Homey.ManagerSettings.get('zonesIgnored') as string[];
        console.log(`Ignored zones: ${this.zonesIgnored}`);
        await this.updateDeviceConfig();
      } else if (variable === 'zonesNotMonitored') {
        this.zonesNotMonitored = Homey.ManagerSettings.get('zonesNotMonitored') as string[];
        console.log(`Zones not monitored: ${this.zonesNotMonitored}`);
        await this.updateDeviceConfig();
      } else if (variable === 'devicesIgnored') {
        this.devicesIgnored = Homey.ManagerSettings.get('devicesIgnored') as string[];
        console.log(`Ignored devices: ${this.devicesIgnored}`);
        await this.updateDeviceConfig();
      }
    });

    this.triggers.register();
    this.actions.register();
    this.triggers.disable();

    await this.enumerateDevices();
    this.triggers.enable();

  }
  public getTriggers(): Triggers {
    return this.triggers;
  }

  public getMinTemp() {
    return settings.minTemperature;
  }
  public getMaxTemp() {
    return settings.maxTemperature;
  }

  public getZones(): IZoneList {
    return this.zones.getAll();
  }

  public async getDevices(): Promise<IDeviceList> {
    const api = await this.getApi();
    return api.devices.getDevices() as any as Promise<IDeviceList>;
  }

  private async installTasks() {
    try {
      await (Homey.ManagerCron as any).unregisterTask('dailyreset');
    } catch (error) { 
      console.log("Failed to remove non existing job", error);
    }
    const cron = this.getDailyRestCron();
    console.log(`Updated time to: ${cron}`)
    this.task = await (Homey.ManagerCron as any).registerTask('dailyreset', cron);
    this.task.on('run', (data) => {
      console.log('Reseting all zones max/min temperatures: ' + new Date(), data);
      this.zones.resetMaxMin();
    });
  }
  private getDailyRestCron() {
    const parts = settings.dailyReset.split(":");
    const hour = parts.length > 0 ? parts[0] : '2';
    const minute = parts.length > 1 ? parts[1] : '00';
    return `0 ${minute} ${hour} * * *`;
  }

  private async updateDeviceConfig() {
    await this.zones.updateDevices(this.zonesIgnored, this.zonesNotMonitored, this.devicesIgnored);
  }

  private async getApi(): Promise<HomeyAPI> {
    if (this.api === undefined) {
      this.api = await HomeyAPI.forCurrentHomey();
    }
    return this.api;
  }

  private async enumerateDevices() {
    const api = await this.getApi();
    (api.devices as any).on('device.create', async id => {
      const device = await this.waitForDevice(id, 12);
      if (device) {
        await this.addDevice(device as IDeviceType);
      }
    });

    (api.devices as any).on('device.delete', async id => {
      await this.zones.removeDeviceById(id);
    });

    const allDevices = await (api.devices.getDevices() as any as Promise<IDeviceList>);
    for (const id in allDevices) {
      const device = await this.waitForDevice(allDevices[id], 12);
      if (device) {
        await this.addDevice(device as IDeviceType);
      }
    }
  }

  private async waitForDevice(device, timeToWait): Promise<IDeviceType | boolean> {
    const api = await this.getApi();
    const resultDevice = await (api.devices.getDevice({ id: device.id }) as any as Promise<IDeviceType>);
    if (resultDevice.ready) {
      return resultDevice;
    }
    await delay(1000);
    if (timeToWait > 0) {
      return this.waitForDevice(device, timeToWait--);
    } else {
      console.log('Found Device, not ready:    ' + resultDevice.name);
      devicesNotReadyAtStart.push(resultDevice.name);
      return false;
    }
  }

  private async addDevice(device: IDeviceType) {
    if (!('measure_temperature' in device.capabilitiesObj)) {
      return;
    }
    const zone = this.zones.addZone(device.zone, device.zoneName);
    await zone.addDevice(device);
    (device as any).makeCapabilityInstance(
      'measure_temperature',
      async (temperature: number) => {
        await zone.updateTemp(device.id, temperature);
      }
    );
  }

}

export = TempManager;
