import { __, app, Device } from 'homey';
import { ITemperatureManager } from '../../interfaces/ITemperatureManager';
import { error, log } from '../../LogManager';
import { Catch } from '../../utils';
import { CapabilityWrapper } from './CapabilityWrapper';
import { capabilities } from './DriverImpl';

interface IData {
  id: string;
}
class ZoneTemperatue extends Device {
  private max: CapabilityWrapper;
  private min: CapabilityWrapper;
  private cur: CapabilityWrapper;
  @Catch(true)
  public async onInit() {
    const id = this.getMyData().id || 'none';
    log(`Adding device for ${id}`);
    this.max = new CapabilityWrapper(this, capabilities.max);
    this.min = new CapabilityWrapper(this, capabilities.min);
    this.cur = new CapabilityWrapper(this, capabilities.temp);

    app.get().subscribeToZone(id, async () => {
      const z = this.getTM().getZones()[id];
      if (!z) {
        error(`No device found for ${id}`);
        return;
      }
      await this.max.set(z.getCurrentMax());
      await this.min.set(z.getCurrentMin());
      await this.cur.set(z.getTemperature());
    });
  }

  private getMyData(): IData {
    return this.getData() as IData;
  }
  private getTM(): ITemperatureManager {
    return app.get() as ITemperatureManager;
  }
}

module.exports = ZoneTemperatue;
