import { HomeyAPI } from 'athom-api';
import Homey from 'homey';
import { Actions } from './Actions';
import { DeviceManager } from './DeviceManager';
import { ICronTaskType } from './interfaces/ICronTaskType';
import { IDeviceList } from './interfaces/IDeviceType';
import { IManager } from './interfaces/IManager';
import { IAppState, IDeviceConfig, ISettings, SettingsManager } from './SettingsManager';
import { Triggers } from './Triggers';
import { IZoneList, Zones } from './Zones';

const taskname = 'dailyreset';
class TempManager extends Homey.App implements IManager {
  private api: HomeyAPI | undefined;
  private triggers: Triggers;
  private actions: Actions;
  private zones: Zones;
  private task: any;
  private deviceManager: DeviceManager;
  private settingsManager: SettingsManager;

  constructor(path: string) {
    super(path);
    this.api = undefined;
    this.triggers = new Triggers();
    this.zones = new Zones(this);
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
      onSettingsUpdated: async (settings: ISettings, old:ISettings) => {
        console.log("Settings updated: ", settings);
        this.zones.onUpdateSettings(settings);
        if (settings.dailyReset !== old.dailyReset) {
          console.log("Settings changed");
          await this.installTasks();
        }
      },
    });
  }


  public async onInit() {
    try {
      this.api = await HomeyAPI.forCurrentHomey();
      this.deviceManager = new DeviceManager(this.api, this.zones);
      await this.settingsManager.start();

      console.log("onInit");
      await this.installTasks();

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

  public onZoneUpdated() {
    this.settingsManager.setState({
      zones: this.zones.getState(),
    });
  }

  private async installTasks() {
    try {
      console.log("installing scheduled tasks");
      try {
        const tasks = await (Homey.ManagerCron as any).getTasks(taskname) as ICronTaskType[];
        for (const task of tasks) {
          console.log(`Uninstalling task: ${task.id}`);
          await (Homey.ManagerCron as any).unregisterTask(task.id);
        }
      } catch (error) {
        console.log("Failed to remove existing job", error);
      }
      if (this.settingsManager.getSettings().dailyReset !== "never") {
        const cron = this.getDailyRestCron();
        console.log(`Updated time to: ${cron}`)
        this.task = await (Homey.ManagerCron as any).registerTask(taskname, cron);
        this.task.on('run', () => {
          console.log('Reseting all zones max/min temperatures: ' + new Date());
          this.zones.resetMaxMin();
        });
      } else {
        console.log('Reseting of max/min temperatures is disabled');
      }
    } catch (error) {
      console.log("Failed to reset task", error);
    }
  }
  private getDailyRestCron() {
    const parts = this.settingsManager.getSettings().dailyReset.split(":");
    const hour = parts.length > 0 ? parts[0] : '2';
    const minute = parts.length > 1 ? parts[1] : '00';
    return `0 ${minute} ${hour} * * *`;
  }
}

export = TempManager;
