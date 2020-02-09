import Homey from 'homey';
import { IDeviceList, IDeviceType } from './interfaces/IDeviceType';
import { ITemperatureManager } from './interfaces/ITemperatureManager';
import { Zone } from './Zone';

function getValue(node: IDeviceType, capability: string, fallback: string): any {
  if (node.capabilitiesObj && node.capabilitiesObj[capability] && node.capabilitiesObj[capability].value) {
    return node.capabilitiesObj[capability].value;
  }
  return fallback;
}
module.exports = [
  {
    description: 'Retrieve all devices with their information',
    fn: (args, callback) => {
      (Homey.app.get() as ITemperatureManager)
        .getDevices()
        .then((res: IDeviceList) => {
          const devices = Object.values(res)
            .filter(
              device => device.capabilitiesObj && Object.keys(device.capabilitiesObj).includes('measure_temperature'),
            )
            .map((device: IDeviceType) => ({
              battery: getValue(device, 'measure_battery', '?'),
              icon: device.iconObj.url,
              id: device.id,
              name: device.name,
              temperature: getValue(device, 'measure_temperature', '?'),
              zone: device.zone,
              zoneName: device.zoneName,
            }))
            .sort((a, b) =>
              a.zoneName === b.zoneName ? a.name.localeCompare(b.name) : a.zoneName.localeCompare(b.zoneName),
            );
          callback(null, devices);
        })
        .catch(error => callback(error, null));
    },
    method: 'GET',
    path: '/devices',
  },
  {
    description: 'Retrieve all zones with their information',
    fn: (args, callback) => {
      const zones = Object.values((Homey.app.get() as ITemperatureManager).getZones())
        .filter(zone => zone.hasDevice())
        .map((zone: Zone) => ({
          id: zone.getId(),
          max: zone.periodTemp.maxValue,
          min: zone.periodTemp.minValue,
          name: zone.getName(),
          temperature: zone.getCurrentAvg(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      callback(null, zones);
    },
    method: 'GET',
    path: '/zones',
  },
  {
    description: 'Retrieve logs',
    fn: (args, callback) => {
      callback(
        null,
        (Homey.app.get() as ITemperatureManager).getLogs().map(l => ({
          date: l.date.toISOString(),
          level: l.level,
          message: l.message,
        })),
      );
    },
    method: 'GET',
    path: '/logs',
  },
];
