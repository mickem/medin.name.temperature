import Homey from 'homey';
import { IDeviceList, IDeviceType } from "./interfaces/IDeviceType";
import { IManager } from "./interfaces/IManager";
import { Zone } from "./Zone";

module.exports = [
  {
    description: 'Retrieve all devices with their information',
    fn: (args, callback) => {
      (Homey.app as IManager)
        .getDevices()
        .then((res: IDeviceList) => {
          callback(null,
            Object
              .values(res)
              .filter(device => device.capabilitiesObj && Object.keys(device.capabilitiesObj).includes("measure_temperature"))
              .map((device: IDeviceType) => ({
                battery: device.capabilitiesObj && device.capabilitiesObj.measure_battery && device.capabilitiesObj.measure_battery.value || '?',
                icon: device.iconObj.url,
                id: device.id,
                name: device.name,
                temperature: device.capabilitiesObj && device.capabilitiesObj.measure_temperature && device.capabilitiesObj.measure_temperature.value || '?',
                zone: device.zone,
                zoneName: device.zoneName,
              }))
              .sort((a, b) => a.zoneName > b.zoneName ? -1 : a.zoneName < b.zoneName ? 1 : a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
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
      const res = Object.values((Homey.app as IManager)
        .getZones())
        .filter(zone => zone.hasDevice())
        .map((zone: Zone) => ({
          id: zone.getId(),
          max: zone.getMax(),
          min: zone.getMin(),
          name: zone.getName(),
          temperature: zone.getTemperature(),
        }))
        .sort((a, b) => a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
        ;
      callback(null, res);
    },
    method: 'GET',
    path: '/zones',
  },
];

