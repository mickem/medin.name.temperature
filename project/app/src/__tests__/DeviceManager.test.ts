import { HomeyAPI } from 'athom-api';
import { DeviceManager } from '../DeviceManager';
import { IDeviceList } from '../interfaces/IDeviceType';
import { makeDeviceEx, makeZones } from '../TestHelpers';

jest.mock('athom-api');

describe('can setup subscriptions', () => {
  const zones = makeZones();
  zones.findDevice = jest.fn();
  zones.moveDevice = jest.fn();
  zones.removeDeviceById = jest.fn();
  zones.addZone = jest.fn();
  zones.addDevice = jest.fn();
  zones.getZoneById = jest.fn();
  zones.removeZone = jest.fn();
  const zonesObj = {
    z1: { id: 'z1', name: 'Zone 1' },
    z2: { id: 'z2', name: 'Zone 2' },
    z3: { id: 'z3', name: 'Zone 3' },
  };
  let device;
  let mock;
  const devices: IDeviceList = {
    d1: makeDeviceEx('d1', 'device 1', 'z1', 'zone 1', 33),
    d2: makeDeviceEx('d2', 'device 2', 'z1', 'zone 1', 33),
    d3: makeDeviceEx('d3', 'device 3', 'z3', 'zone 3', 33),
    d4: makeDeviceEx('d4', 'device 4', 'z3', 'zone 1', 33),
  };
  test('can create', async () => {
    mock = await HomeyAPI.forCurrentHomey();
    device = new DeviceManager(mock, zones);
    expect(device).toBeDefined();
    (mock.zones.getZones as jest.Mock).mockReturnValue(zonesObj);
    (mock.devices.getDevices as jest.Mock).mockReturnValue(devices);
    (mock.devices.getDevice as jest.Mock).mockImplementation(args => devices[args.id]);
  });

  test('Should return promises on creation', async () => {
    expect(await device.start()).toEqual([true, true]);
  });

  test('can add initial zones', async () => {
    expect(zones.addZone).toBeCalledTimes(3);
    expect(zones.addZone).toHaveBeenNthCalledWith(1, 'z1', 'Zone 1');
    expect(zones.addZone).toHaveBeenNthCalledWith(3, 'z3', 'Zone 3');
  });
  test('can add initial devices', async () => {
    expect(zones.addDevice).toBeCalledTimes(4);
    expect(zones.addDevice).toHaveBeenNthCalledWith(1, mock.devices.getDevice({ id: 'd1' }));
    expect(zones.addDevice).toHaveBeenNthCalledWith(4, mock.devices.getDevice({ id: 'd4' }));
  });

  test('can add new devices later', async () => {
    (zones.addDevice as jest.Mock).mockReset();
    devices['d5'] = makeDeviceEx('d5', 'device 5', 'z3', 'zone 1', 33);
    await (mock.devices as any).fire('device.create', devices['d5']);
    expect(zones.addDevice).toBeCalledWith(devices['d5']);
  });
  test('non thermometers should be ignored', async () => {
    (zones.addDevice as jest.Mock).mockReset();
    devices['d6'] = makeDeviceEx('d6', 'device 6', 'z3', 'zone 1', 33);
    delete devices['d6'].capabilitiesObj['measure_temperature'];
    await (mock.devices as any).fire('device.create', devices['d6']);
    expect(zones.addDevice).not.toBeCalled();
  });
  test('can be renamed', async () => {
    devices['d5'].name = 'new name';
    const mockDevice = {
      name: 'old name',
      setName: jest.fn(),
      getZoneId: jest.fn().mockReturnValue('z3'),
    };
    (zones.findDevice as jest.Mock).mockReturnValue(mockDevice);
    await (mock.devices as any).fire('device.update', devices['d5']);
    expect(mockDevice.setName).toBeCalledWith('new name');
  });
  test('can move device from one zone to another', async () => {
    devices['d5'].zone = 'z1';
    (zones.findDevice as jest.Mock).mockReturnValue({ getZoneId: () => 'z3' });
    await (mock.devices as any).fire('device.update', devices['d5']);
    expect(zones.moveDevice).toBeCalledWith(expect.anything(), 'z3', 'z1', 'zone 1');
  });
  test('update of non thermometers should be ignored', async () => {
    (zones.findDevice as jest.Mock).mockReset();
    await (mock.devices as any).fire('device.update', devices['d6']);
    expect(zones.findDevice).not.toBeCalled();
  });
  test('can delete devices', async () => {
    (zones.removeDeviceById as jest.Mock).mockReset();
    await (mock.devices as any).fire('device.delete', devices['d6']);
    expect(zones.removeDeviceById).toBeCalledWith('d6');
  });

  test('should be able to add zones after creation', async () => {
    (zones.addZone as jest.Mock).mockReset();
    zonesObj['z4'] = { id: 'z4', name: 'Zone 4' };
    await (mock.zones as any).fire('zone.create', zonesObj['z4']);
    expect(zones.addZone).toBeCalledWith('z4', 'Zone 4');
  });
  test('zones should be able to change their name', async () => {
    const mockZone = {
      getName: () => 'old name',
      setName: jest.fn(),
    };
    (zones.getZoneById as jest.Mock).mockReturnValue(mockZone);
    zonesObj['z4'].name = 'New Name';
    await (mock.zones as any).fire('zone.update', zonesObj['z4']);
    expect(mockZone.setName).toBeCalledWith('New Name');
  });

  test('should be able to delete zones', async () => {
    (zones.removeZone as jest.Mock).mockReset();
    await (mock.zones as any).fire('zone.delete', zonesObj['z4']);
    expect(zones.removeZone).toBeCalledWith('z4');
  });
});
