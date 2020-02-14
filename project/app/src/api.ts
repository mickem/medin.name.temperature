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
      const devices = (Homey.app.get() as ITemperatureManager)
        .getDevices()
        .map(device => ({
          battery: device.battery || '?',
          humidity: device.humidity || '?',
          icon: device.icon,
          id: device.id,
          name: device.name,
          temperature: device.temp || '?',
          zone: device.getZoneId(),
          zoneName: device.getZone(),
        }))
        .sort((a, b) =>
          a.zoneName === b.zoneName ? a.name.localeCompare(b.name) : a.zoneName.localeCompare(b.zoneName),
        );
      callback(null, devices);
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
          humidity: {
            active: zone.currentHumidity.average !== undefined,
            currentAvg: zone.currentHumidity.average,
            currentMax: zone.currentHumidity.max,
            currentMin: zone.currentHumidity.max,
            periodAvg: zone.periodHumidity.get_delayed(),
            periodMax: zone.periodHumidity.maxValue,
            periodMin: zone.periodHumidity.minValue,
          },
          icon: zone.icon,
          id: zone.getId(),
          name: zone.getName(),
          temperature: {
            active: zone.currentTemp.average !== undefined,
            currentAvg: zone.currentTemp.average,
            currentMax: zone.currentTemp.max,
            currentMin: zone.currentTemp.max,
            periodAvg: zone.periodTemp.get_delayed(),
            periodMax: zone.periodTemp.maxValue,
            periodMin: zone.periodTemp.minValue,
          },
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
