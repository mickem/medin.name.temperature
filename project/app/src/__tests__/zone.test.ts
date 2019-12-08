import { IManager } from '../interfaces/IManager';
import { Triggers } from '../Triggers';
import { Zone } from '../Zone';

const fakeManager: IManager = {
  getMinTemp() {
    return 7;
  },
  getMaxTemp() {
    return 12;
  },

  getTriggers() {
    return ({
      register() { },
      enable() { },
      disable() { },


      async onMaxUpdated(zone: string, device: string, temp: number) { },
      async onMinUpdated(zone: string, device: string, temp: number) { },

      async onTooWarm(zone: string, temp: number) { },
      async onTooCold(zone: string, temp: number) { },
      async onTempUpdated(zone: string, temp: number) { },
    } as any as Triggers);
  },
  getZones() {
    return {};
  },
  async getDevices() {
    return {}
  }

};

test('create zone', () => {
  const z = new Zone(fakeManager, '1', 'Hello', false, true, []) as any;
  expect(z.getName()).toEqual('Hello');
  expect(z.devices).toHaveLength(0);
  expect(z.minTemp).toBeUndefined();
  expect(z.maxTemp).toBeUndefined();
  expect(z.minSensor).toBeUndefined();
  expect(z.maxSensor).toBeUndefined();
  expect(z.minAllowed).toEqual(7);
  expect(z.maxAllowed).toEqual(12);
});

test('add a device', () => {
  const z = new Zone(fakeManager, '1', 'Hello', false, true, []) as any;
  z.addDevice({
    id: '123456',
    name: 'Device',
    temperature: 8,
  });
  expect(z.devices).toHaveLength(1);
  expect(z.minTemp).toEqual(8);
  expect(z.maxTemp).toEqual(8);
  expect(z.minSensor).toEqual('Device');
  expect(z.maxSensor).toEqual('Device');
});

test('add multiple devices', () => {
  const z = new Zone(fakeManager, '1', 'Hello', false, true, []) as any;
  z.addDevice({
    id: '1',
    name: 'Device 1',
    temperature: 8,
  });
  z.addDevice({
    id: '2',
    name: 'Device 2',
    temperature: 9,
  });
  z.addDevice({
    id: '3',
    name: 'Device 3',
    temperature: 7,
  });
  expect(z.devices).toHaveLength(3);
  expect(z.minTemp).toEqual(7);
  expect(z.maxTemp).toEqual(9);
  expect(z.minSensor).toEqual('Device 3');
  expect(z.maxSensor).toEqual('Device 2');
});

test('update temperature', () => {
  const z = new Zone(fakeManager, '1', 'Hello', false, true, []) as any;
  z.addDevice({
    id: '1',
    name: 'Device 1',
    temperature: 8,
  });
  z.addDevice({
    id: '2',
    name: 'Device 2',
    temperature: 9,
  });
  z.addDevice({
    id: '3',
    name: 'Device 3',
    temperature: 7,
  });
  expect(z.maxTemp).toEqual(9);
  expect(z.maxSensor).toEqual('Device 2');
  expect(z.current).toEqual(8);
  z.updateTemp('3', 22);
  expect(z.maxTemp).toEqual(22);
  expect(z.maxSensor).toEqual('Device 3');
  expect(z.current).toEqual(13);
});
