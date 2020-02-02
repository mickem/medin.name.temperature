import Homey from 'homey';
import { IDeviceList, IDeviceType } from './interfaces/IDeviceType';
import { ITemperatureManager } from './interfaces/ITemperatureManager';
import { Zone } from './Zone';

module.exports = [
  {
    description: 'Retrieve all devices with their information',
    fn: (args, callback) => {
      (Homey.app.get() as ITemperatureManager)
        .getDevices()
        .then((res: IDeviceList) => {
          callback(
            null,
            Object.values(res)
              .filter(
                device => device.capabilitiesObj && Object.keys(device.capabilitiesObj).includes('measure_temperature'),
              )
              .map((device: IDeviceType) => ({
                battery:
                  (device.capabilitiesObj &&
                    device.capabilitiesObj.measure_battery &&
                    device.capabilitiesObj.measure_battery.value) ||
                  '?',
                icon: device.iconObj.url,
                id: device.id,
                name: device.name,
                temperature:
                  (device.capabilitiesObj &&
                    device.capabilitiesObj.measure_temperature &&
                    device.capabilitiesObj.measure_temperature.value) ||
                  '?',
                zone: device.zone,
                zoneName: device.zoneName,
              }))
              .sort((a, b) =>
                a.zoneName > b.zoneName
                  ? -1
                  : a.zoneName < b.zoneName
                  ? 1
                  : a.name > b.name
                  ? -1
                  : a.name < b.name
                  ? 1
                  : 0,
              ),
          );
        })
        .catch(error => callback(error, null));
    },
    method: 'GET',
    path: '/devices',
  },
  {
    description: 'Retrieve all zones with their information',
    fn: (args, callback) => {
      const res = Object.values((Homey.app.get() as ITemperatureManager).getZones())
        .filter(zone => zone.hasDevice())
        .map((zone: Zone) => ({
          id: zone.getId(),
          max: zone.getDailyMax(),
          min: zone.getDailyMin(),
          name: zone.getName(),
          temperature: zone.getTemperature(),
        }))
        .sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
      callback(null, res);
    },
    method: 'GET',
    path: '/zones',
  },
  {
    description: 'Retrieve logs',
    fn: (args, callback) => {
      callback(null, (Homey.app.get() as ITemperatureManager).getLogs());
    },
    method: 'GET',
    path: '/logs',
  },
];
