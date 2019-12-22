import { ITriggers } from 'src/Triggers';
import { IZoneList } from '../Zones';
import { IDeviceList } from './IDeviceType';

export interface ITemperatureManager {
  getTriggers(): ITriggers;
  getZones(): IZoneList;
  getDevices(): Promise<IDeviceList>;
}
