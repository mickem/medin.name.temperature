import Homey from 'homey';
import { TempManager } from './TemperatureManager';

const mgr = new TempManager();

class Wrapper extends Homey.App {
  public async onInit() {
    await mgr.onInit();
  }
  public get(): TempManager {
    return mgr;
 }
}

export = Wrapper;
