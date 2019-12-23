import { HomeyAPI } from 'athom-api';
import { ActionManager } from './ActionManager';
import { IActionHandler } from './Actions';
import { DeviceManager } from './DeviceManager';
import { __ } from './HomeyWrappers';
import { IDeviceList } from './interfaces/IDeviceType';
import { ITemperatureManager } from './interfaces/ITemperatureManager';
import { JobManager } from './JobManager';
import { IAppState, IDeviceConfig, ISettings, SettingsManager } from './SettingsManager';
import { TriggerManager } from './TriggerManager';
import { ITriggers } from './Triggers';
import { Catch } from './utils';
import { IZoneList, Zones } from './Zones';

interface IZoneLisener {
  [key: string]: Array<() => void>;
}
export class TempManager implements ITemperatureManager {
  private api: HomeyAPI | undefined;
  private triggers: TriggerManager<ITriggers>;
  private actions: ActionManager<IActionHandler>;
  private zones: Zones;
  private deviceManager: DeviceManager;
  private settingsManager: SettingsManager;
  private jobManager: JobManager;
  private listeners: IZoneLisener;
  private loaded: boolean;

  constructor() {
    this.loaded = false;
    console.log(`Starting temperature manager`);
    this.api = undefined;
    this.listeners = {};
    this.triggers = new TriggerManager([
      'TemperatureChanged',
      'TooCold',
      'TooWarm',
      'MinTemperatureChanged',
      'MaxTemperatureChanged',
    ]);
    this.zones = new Zones(this.triggers.get(), {
      onZoneUpdated: (id: string) => {
        if (this.listeners[id] !== undefined) {
          for (const cb of this.listeners[id]) {
            cb();
          }
        }
        this.settingsManager.setState({
          zones: this.zones.getState(),
        });
      },
    });
    this.actions = new ActionManager({
      SetTemperatureBounds: args => {
        if (args.type === 'min') {
          console.log(`A flow updated the minimum temperature bound to ${args.temperature}`);
          this.settingsManager.setSettings({ minTemperature: args.temperature });
        } else if (args.type === 'max') {
          console.log(`A flow updated the maximum temperature bound to ${args.temperature}`);
          this.settingsManager.setSettings({ maxTemperature: args.temperature });
        } else {
          console.error(`Unknown bound ${args.type}`);
          return false;
        }
        return true;
      },
      SetZoneMode: args => {
        const zone = this.zones.findZoneByName(args.zone);
        if (!zone) {
          console.error(`Failed to find zone for ${args.zone}`);
          return false;
        }
        if (args.mode === 'enabled') {
          console.log(`A flow enabled ${zone.getId()} as ${zone.getName()}`);
          this.settingsManager.addZoneEnabled(zone.getId());
        } else if (args.mode === 'disabled') {
          console.log(`A flow disabled ${zone.getId()} as ${zone.getName()}`);
          this.settingsManager.addZoneDisabled(zone.getId());
        } else if (args.mode === 'monitored') {
          console.log(`A flow set ${zone.getId()} as ${zone.getName()} to monitored`);
          this.settingsManager.addZoneMonitored(zone.getId());
        } else {
          console.error(`A flow set unkown mode (${args.mode}) for ${args.zone}`);
          return false;
        }
        return true;
      },
    });
    this.settingsManager = new SettingsManager({
      onAppState: (state: IAppState) => {
        if (state.zones) {
          this.zones.setState(state.zones);
        }
      },
      onDeviceConfigUpdated: async (config: IDeviceConfig) => {
        await this.zones.updateDevices(
          config.zonesIgnored || [],
          config.zonesNotMonitored || [],
          config.devicesIgnored || [],
        );
      },
      onSettingsUpdated: async (settings: ISettings) => {
        this.zones.onUpdateSettings(settings);
        await this.jobManager.onSettinsUpdated(settings.dailyReset);
      },
    });
    this.jobManager = new JobManager({
      onResetMaxMin: () => {
        console.log('Reseting all zones max/min temperatures: ' + new Date());
        this.zones.resetMaxMin();
      },
    });
  }

  @Catch()
  public async onInit() {
    console.log(`Booting temperature manager`);
    this.api = await HomeyAPI.forCurrentHomey();
    this.deviceManager = new DeviceManager(this.api, this.zones);
    await this.settingsManager.start();
    await this.jobManager.start();

    this.triggers.register();
    this.actions.register();

    this.triggers.disable();
    await this.deviceManager.start();
    this.triggers.enable();

    for (const key in this.listeners) {
      for (const cb of this.listeners[key]) {
        cb();
      }
    }

    console.log(`${this.zones.countDevices()} devices monitored, enabling triggers`);
    this.loaded = true;
  }
  public getTriggers(): ITriggers {
    return this.triggers.get();
  }

  public getZones(): IZoneList {
    return this.zones.getAll();
  }
  public subscribeToZone(id: string, callback: () => void) {
    if (id in this.listeners) {
      this.listeners[id].push(callback);
    } else {
      this.listeners[id] = [callback];
    }
    if (this.loaded) {
      callback();
    }
  }

  public async getDevices(): Promise<IDeviceList> {
    return (this.api.devices.getDevices() as any) as Promise<IDeviceList>;
  }
}
