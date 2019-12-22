import Homey from 'homey';
import { TempManager } from './TemperatureManager';

const mgr = new TempManager();
class Wrapper extends Homey.App {
  public get(): TempManager {
    return mgr;
  }
  public async onInit() {
    await mgr.onInit();
  }
}

export = Wrapper;
