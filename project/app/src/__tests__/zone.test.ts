import { ISettings } from '../SettingsManager';
import { FakeManager, makeDevice, makeDeviceEx } from "../TestHelpers";
import { Zone } from '../Zone';

test('create zone', () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  z.onUpdateSettings({
    maxTemperature: 12,
    minTemperature: 7,
  } as ISettings);
  expect(z.getName()).toEqual('Hello');
  expect(z.hasDevice()).toBeFalsy();
  expect((z as any).devices).toHaveLength(0);
  expect(z.getMin()).toBeUndefined();
  expect(z.getMax()).toBeUndefined();
  expect((z as any).minSensor).toBeUndefined();
  expect((z as any).maxSensor).toBeUndefined();
  expect((z as any).minAllowed).toEqual(7);
  expect((z as any).maxAllowed).toEqual(12);
});
describe('adding devices', () => {
  test('add a device', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    await z.addDevice(makeDevice("123456", "Device", "zone1", "zone one", "8"));
    expect((z as any).devices).toHaveLength(1);
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('Hello');
    expect(z.getTemperature()).toEqual(8);
    expect(z.getMin()).toEqual(8);
    expect(z.getMax()).toEqual(8);
    expect((z as any).minSensor).toEqual('Device');
    expect((z as any).maxSensor).toEqual('Device');
  });

  test('change name', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('Hello');
    z.setName("New name");
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('New name');
  });

  test('add a device without temperature', async () => {
    const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
    await z.addDevice(makeDeviceEx("123456", "Device", "zone1", "zone one", undefined));
    expect((z as any).devices).toHaveLength(1);
    expect(z.getTemperature()).toEqual(undefined);
    expect(z.getMin()).toEqual(undefined);
    expect(z.getMax()).toEqual(undefined);
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
    expect(z.getMin()).toEqual(7);
    expect(z.getMax()).toEqual(9);
    expect((z as any).minSensor).toEqual('Device 3');
    expect((z as any).maxSensor).toEqual('Device 2');
  });
})
describe('update temperature', () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  beforeAll(async () => {
    await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
    await z.addDevice(makeDevice("2", "Device 2", "zone1", "zone one", "9"));
    await z.addDevice(makeDevice("3", "Device 3", "zone1", "zone one", "7"));
  });
  test('update should work', async () => {
    expect(z.getMax()).toEqual(9);
    expect((z as any).maxSensor).toEqual('Device 2');
    expect(z.getTemperature()).toEqual(8);
    await z.updateTemp('3', 22);
    expect(z.getMax()).toEqual(22

    );
    expect((z as any).maxSensor).toEqual('Device 3');
    expect(z.getTemperature()).toEqual(13);
  })
  test('missing device should be ignored', async () => {
    await z.updateTemp('99', 22);

    await z.setIgnored(true)
    await z.updateTemp('99', 22);
  })

})


describe('device by id', () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);

  beforeAll(async () => {
    await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
    await z.addDevice(makeDevice("2", "Device 2", "zone1", "zone one", "9"));
    await z.addDevice(makeDevice("3", "Device 3", "zone1", "zone one", "7"));
  });

  test('can get a device by id', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.findDevice("1").id).toEqual('1');
    expect(z.findDevice("3").id).toEqual('3');
  });
  test('missing item is undefined', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.findDevice("4")).toBeUndefined();
  });
  test('ignored devices are ignored', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.getTemperature()).toEqual(8);

    await z.setDevicesIgnored(['1', '2']);

    expect((z as any).devices).toHaveLength(3);
    expect(z.getTemperature()).toEqual(7);

    await z.setDevicesIgnored([]);
    expect((z as any).devices).toHaveLength(3);
    expect(z.getTemperature()).toEqual(8);
  });
  test('remove device', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.getTemperature()).toEqual(8);

    await z.removeDevice("3");
    await z.removeDevice("1");

    expect((z as any).devices).toHaveLength(1);
    expect(z.getTemperature()).toEqual(9);
  });
});




test('can reset max/min', async () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
  await z.updateTemp("1", -4);
  await z.updateTemp("1", 66);
  await z.updateTemp("1", 2);

  expect(z.getTemperature()).toEqual(2);
  expect(z.getMin()).toEqual(-4);
  expect(z.getMax()).toEqual(66);

  z.resetMaxMin();

  expect(z.getTemperature()).toEqual(2);
  expect(z.getMin()).toBeUndefined();
  expect(z.getMax()).toBeUndefined();

  await z.updateTemp("1", 4);

  expect(z.getTemperature()).toEqual(4);
  expect(z.getMin()).toEqual(4);
  expect(z.getMax()).toEqual(4);

});





test('ignored zones', async () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  await z.addDevice(makeDevice("1", "Device 1", "zone1", "zone one", "8"));
  expect(z.getTemperature()).toEqual(8);
  await z.setIgnored(true);
  expect(z.getTemperature()).toBeUndefined();
  await z.updateTemp('1', 3);
  expect(z.getTemperature()).toBeUndefined();
  await z.setIgnored(false);
  expect(z.getTemperature()).toEqual(3);
});


test('update settings should work', async () => {
  const z = new Zone(new FakeManager(), '1', 'Hello', false, true, []);
  expect((z as any).minAllowed).toBeUndefined();
  expect((z as any).maxAllowed).toBeUndefined();
  z.onUpdateSettings({minTemperature: 4, maxTemperature: 8} as ISettings);
  expect((z as any).minAllowed).toEqual(4);
  expect((z as any).maxAllowed).toEqual(8);
  z.onUpdateSettings({minTemperature: 12, maxTemperature: 17} as ISettings);
  expect((z as any).minAllowed).toEqual(12);
  expect((z as any).maxAllowed).toEqual(17);
});