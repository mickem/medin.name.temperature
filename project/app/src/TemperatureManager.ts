import { HomeyAPI } from 'athom-api';
import Homey from 'homey';
import { ActionManager } from './ActionManager';
import { DeviceManager } from './DeviceManager';
import { __ } from './HomeyWrappers'
import { IDeviceList } from './interfaces/IDeviceType';
import { IManager } from './interfaces/IManager';
import { JobManager } from './JobManager';
import { IAppState, IDeviceConfig, ISettings, SettingsManager } from './SettingsManager';
import { Triggers } from './Triggers';
import { Catch } from './utils';
import { IZoneList, Zones } from './Zones';

export class TempManager implements IManager {
  private api: HomeyAPI | undefined;
  private triggers: Triggers;
  private actions: ActionManager;
  private zones: Zones;
  private deviceManager: DeviceManager;
  private settingsManager: SettingsManager;
  private jobManager: JobManager;

  constructor() {
    this.api = undefined;
    this.triggers = new Triggers();
    console.log("creating zoned");
    this.zones = new Zones(this.triggers, {
      onZoneUpdated: () => {
        this.settingsManager.setState({
          zones: this.zones.getState(),
        });
      }

    });
    this.actions = new ActionManager({
      SetTemperatureBounds: (args) => {
        if (args.type === "min") {
          console.log("---> set min temperature bound: ", args.temperature);
          this.settingsManager.setSettings({ minTemperature: args.temperature });
        } else if (args.type === "max") {
          console.log("---> set max temperature bound: ", args.temperature);
          this.settingsManager.setSettings({ maxTemperature: args.temperature });
        } else {
          console.error(`Unknown bound ${args.type}`);
          return false;
        }
        return true;
      },
      SetZoneMode: (args) => {
        const zone = this.zones.findZoneByName(args.zone);
        if (!zone) {
          console.error(`Failed to find zone for ${args.zone}`);
          return false;
        }
        if (args.mode === "enabled") {
          console.log("---> SetZoneMode enabling: ", zone.getId());
          this.settingsManager.addZoneEnabled(zone.getId());
        } else if (args.mode === "disabled") {
          console.log("---> SetZoneMode disabling: ", zone.getId());
          this.settingsManager.addZoneDisabled(zone.getId());
        } else if (args.mode === "monitored") {
          console.log("---> SetZoneMode monitored: ", zone.getId());
          this.settingsManager.addZoneMonitored(zone.getId());
        } else {
          return false;
        }
        return true;
      }
    });
    console.log("creating settings manager", this.settingsManager);
    this.settingsManager = new SettingsManager({
      onAppState: (state: IAppState) => {
        if (state.zones) {
          this.zones.setState(state.zones);
        }
      },
      onDeviceConfigUpdated: async (config: IDeviceConfig) => {
        console.log("Device configuration updated: ", config);
        await this.zones.updateDevices(config.zonesIgnored || [], config.zonesNotMonitored || [], config.devicesIgnored || []);

      },
      onSettingsUpdated: async (settings: ISettings) => {
        console.log("Settings updated: ", settings);
        this.zones.onUpdateSettings(settings);
        await this.jobManager.onSettinsUpdated(settings.dailyReset);
      },
    });
    console.log("created settings manager", this.settingsManager);
    console.log("job manager");
    this.jobManager = new JobManager({
      onResetMaxMin() {
        console.log('Reseting all zones max/min temperatures: ' + new Date());
        this.zones.resetMaxMin();
      }
    });
  }

  @Catch()
  public async onInit() {
    console.log(__("title"));

    this.api = await HomeyAPI.forCurrentHomey();
    this.deviceManager = new DeviceManager(this.api, this.zones);
    await this.settingsManager.start();

    await this.jobManager.start();

    this.triggers.register();
    this.actions.register();
    this.triggers.disable();

    await this.deviceManager.start();
    this.triggers.enable();
    console.log("Application loaded");
  }
  public getTriggers(): Triggers {
    return this.triggers;
  }

  public getZones(): IZoneList {
    return this.zones.getAll();
  }

  public async getDevices(): Promise<IDeviceList> {
    return this.api.devices.getDevices() as any as Promise<IDeviceList>;
  }
}
