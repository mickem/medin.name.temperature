import { Triggers } from "../Triggers";
import { IZoneList } from "../Zones";
import { IDeviceList } from "./IDeviceType";

export interface IManager {
  onZoneUpdated();
  getTriggers(): Triggers;
  getZones(): IZoneList;
  getDevices(): Promise<IDeviceList>;
}
