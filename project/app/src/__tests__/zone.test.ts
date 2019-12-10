import { IManager } from '../interfaces/IManager';
import { makeDevice, FakeManager } from "../TestHelpers";
import { Triggers } from '../Triggers';
import { Zone } from '../Zone';

test('create zone', () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []) as any;
  expect(z.getName()).toEqual('Hello');
  expect(z.hasDevice()).toBeFalsy();
  expect(z.devices).toHaveLength(0);
  expect(z.minTemp).toBeUndefined();
  expect(z.maxTemp).toBeUndefined();
  expect(z.minSensor).toBeUndefined();
  expect(z.maxSensor).toBeUndefined();
  expect(z.minAllowed).toEqual(7);
  expect(z.maxAllowed).toEqual(12);
});
describe('adding devices', () => {
  test('add a device', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    await z.addDevice(makeDevice("123456", "Device", "zone1", "zone one", "8"));
    expect((z as any).devices).toHaveLength(1);
    expect((z as any).current).toEqual(8);
    expect((z as any).minTemp).toEqual(8);
    expect((z as any).maxTemp).toEqual(8);
    expect((z as any).minSensor).toEqual('Device');
    expect((z as any).maxSensor).toEqual('Device');
  });

  test('add a device without temperature', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    await z.addDevice(makeDevice("123456", "Device", "zone1", "zone one", undefined));
    expect((z as any).devices).toHaveLength(1);
    expect((z as any).current).toEqual(undefined);
    expect((z as any).minTemp).toEqual(undefined);
    expect((z as any).maxTemp).toEqual(undefined);
    expect((z as any).minSensor).toEqual(undefined);
    expect((z as any).maxSensor).toEqual(undefined);
  });

  test('add multiple devices', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
    await z.addDevice(makeDevice("2", "Device 2", "zone1", "zone one", "9"));
    await z.addDevice(makeDevice("3", "Device 3", "zone1", "zone one", "7"));
    expect((z as any).devices).toHaveLength(3);
    expect(z.hasDevice()).toBeTruthy();
    expect((z as any).minTemp).toEqual(7);
    expect((z as any).maxTemp).toEqual(9);
    expect((z as any).minSensor).toEqual('Device 3');
    expect((z as any).maxSensor).toEqual('Device 2');
  });
})
test('update temperature', async () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
  await z.addDevice(makeDevice("2", "Device 2", "zone1", "zone one", "9"));
  await z.addDevice(makeDevice("3", "Device 3", "zone1", "zone one", "7"));
  expect((z as any).maxTemp).toEqual(9);
  expect((z as any).maxSensor).toEqual('Device 2');
  expect((z as any).current).toEqual(8);
  await z.updateTemp('3', 22);
  expect((z as any).maxTemp).toEqual(22);
  expect((z as any).maxSensor).toEqual('Device 3');
  expect((z as any).current).toEqual(13);
});


describe('device by id', () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);

  beforeAll(async () => {
    await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
    await z.addDevice(makeDevice("2", "Device 2", "zone1", "zone one", "9"));
    await z.addDevice(makeDevice("3", "Device 3", "zone1", "zone one", "7"));
    });

  test('can get a device by id', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.getDeviceById("1").id).toEqual('1');
    expect(z.getDeviceById("3").id).toEqual('3');
  });
  test('missing item is undefined', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.getDeviceById("4")).toBeUndefined();
  });
});