import { HomeyAPI } from 'athom-api';
import Homey from 'homey';
import { Actions } from './Actions';
import { DeviceManager } from './DeviceManager';
import { IDeviceList } from './interfaces/IDeviceType';
import { IManager } from './interfaces/IManager';
import { JobManager } from './JobManager';
import { IAppState, IDeviceConfig, ISettings, SettingsManager } from './SettingsManager';
import { Triggers } from './Triggers';
import { IZoneList, Zones } from './Zones';

class TempManager extends Homey.App implements IManager {
  private api: HomeyAPI | undefined;
  private triggers: Triggers;
  private actions: Actions;
  private zones: Zones;
  private deviceManager: DeviceManager;
  private settingsManager: SettingsManager;
  private jobManager: JobManager;

  constructor(path: string) {
    super(path);
    this.api = undefined;
    this.triggers = new Triggers();
    this.zones = new Zones(this.triggers, {
      onZoneUpdated() {
        this.settingsManager.setState({
          zones: this.zones.getState(),
        });
      }

    });
    this.actions = new Actions({
      setMaxTemperature(temperature: number) {
      },
      setMinTemperature(temperature: number) { }
    });
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
        this.jobManager.onSettinsUpdated(settings.dailyReset);
      },
    });
    this.jobManager = new JobManager({
      onResetMaxMin() {
        console.log('Reseting all zones max/min temperatures: ' + new Date());
        this.zones.resetMaxMin();
      }
    });
  }


  public async onInit() {
    try {
      this.api = await HomeyAPI.forCurrentHomey();
      this.deviceManager = new DeviceManager(this.api, this.zones);
      await this.settingsManager.start();

      console.log("onInit");
      await this.jobManager.start();

      this.triggers.register();
      this.actions.register();
      this.triggers.disable();

      await this.deviceManager.start();
      this.triggers.enable();
      console.log("Application loaded");
    } catch (error) {
      console.error(`Failed to handle onInit: ${error}`);
    }

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

export = TempManager;
