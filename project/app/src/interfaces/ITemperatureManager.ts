import { ILogMessage } from '../LogManager';
import { Thermometer } from '../Thermometer';
import { ITriggers } from '../Triggers';
import { IZoneList } from '../Zones';

export interface ITemperatureManager {
  getTriggers(): ITriggers;
  getZones(): IZoneList;
  getDevices(): Thermometer[];
  getLogs(): ILogMessage[];
}
