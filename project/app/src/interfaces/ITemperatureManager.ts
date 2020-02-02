import { ILogMessage} from '../LogManager'
import { ITriggers } from '../Triggers';
import { IZoneList } from '../Zones';
import { IDeviceList } from './IDeviceType';

export interface ITemperatureManager {
  getTriggers(): ITriggers;
  getZones(): IZoneList;
  getDevices(): Promise<IDeviceList>;
  getLogs(): ILogMessage[];
}
