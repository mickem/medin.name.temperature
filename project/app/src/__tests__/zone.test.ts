import { ISettings } from '../SettingsManager';
import { makeDevice, makeDeviceEx, makeZone } from '../TestHelpers';
import { Thermometer } from '../Thermometer';

test('create zone', () => {
  const z = makeZone('1', 'create zone');
  z.onUpdateSettings({
    maxTemperature: 12,
    minTemperature: 7,
  } as ISettings);
  expect(z.getName()).toEqual('create zone');
  expect(z.hasDevice()).toBeFalsy();
  expect((z as any).devices).toHaveLength(0);
  expect(z.getDailyMin()).toBeUndefined();
  expect(z.getDailyMax()).toBeUndefined();
  expect((z as any).minSensor).toBeUndefined();
  expect((z as any).maxSensor).toBeUndefined();
  expect((z as any).minAllowed).toEqual(7);
  expect((z as any).maxAllowed).toEqual(12);
});
describe('adding devices', () => {
  test('add a device', async () => {
    const z = makeZone('1', 'adding devices');
    await z.addDevice(makeDevice('123456', 'Device', 'zone1', 'zone one', '8'));
    expect((z as any).devices).toHaveLength(1);
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('adding devices');
    expect(z.getTemperature()).toEqual(8);
    expect(z.getDailyMin()).toEqual(8);
    expect(z.getDailyMax()).toEqual(8);
  });

  test('change name', async () => {
    const z = makeZone('1', 'change name');
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('change name');
    z.setName('New name');
    expect(z.getId()).toEqual('1');
    expect(z.getName()).toEqual('New name');
  });

  test('add a device without temperature', async () => {
    const z = makeZone('1', 'no temp');
    await z.addDevice(makeDeviceEx('123456', 'Device', 'zone1', 'zone one', undefined));
    expect((z as any).devices).toHaveLength(1);
    expect(z.getTemperature()).toEqual(undefined);
    expect(z.getDailyMin()).toEqual(undefined);
    expect(z.getDailyMax()).toEqual(undefined);
  });

  test('add multiple devices', async () => {
    const z = makeZone('1', 'add multiple');
    await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
    await z.addDevice(makeDevice('2', 'Device 2', 'zone1', 'zone one', '9'));
    await z.addDevice(makeDevice('3', 'Device 3', 'zone1', 'zone one', '7'));
    expect((z as any).devices).toHaveLength(3);
    expect(z.hasDevice()).toBeTruthy();
    expect(z.getDailyMin()).toEqual(7);
    expect(z.getDailyMax()).toEqual(9);
  });
});
describe('update temperature', () => {
  const z = makeZone('1', 'update temp');
  beforeAll(async () => {
    await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
    await z.addDevice(makeDevice('2', 'Device 2', 'zone1', 'zone one', '9'));
    await z.addDevice(makeDevice('3', 'Device 3', 'zone1', 'zone one', '7'));
  });
  test('update should work', async () => {
    expect(z.getDailyMax()).toEqual(9);
    expect(z.getTemperature()).toEqual(8);
    const t = z.findDevice('3');
    await t.update(22);
    expect(z.getDailyMax()).toEqual(22);
    expect(z.getTemperature()).toEqual(13);
  });
});


describe('ensure not monigored works', () => {
  const z = makeZone('1', 'update temp');
  const TemperatureChanged = jest.spyOn((z as any).triggers, 'TemperatureChanged');
  const TooCold = jest.spyOn((z as any).triggers, 'TooCold');
  const TooWarm = jest.spyOn((z as any).triggers, 'TooWarm');
  let t: Thermometer;
  beforeAll(async () => {
    z.onUpdateSettings({
      maxTemperature: 9,
      minTemperature: 7,
    })
    await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
    await z.addDevice(makeDevice('2', 'Device 2', 'zone1', 'zone one', '9'));
    await z.addDevice(makeDevice('3', 'Device 3', 'zone1', 'zone one', '7'));
    t = z.findDevice('3');
  });

  test('setup', () => {
    expect(z.getDailyMax()).toEqual(9);
    expect(z.getDailyMin()).toEqual(7);
    expect(z.getTemperature()).toEqual(8);
  })
  test('enable monitoring', async () => {
    z.setNotMonitored(false);
    TemperatureChanged.mockClear();
    TooCold.mockClear();
    TooWarm.mockClear();
  })

  test('monitored should fire: TemperatureChanged', async () => {
    await t.update(9);
    expect(z.getTemperature()).toEqual(8.7);
    expect(TemperatureChanged).toBeCalledTimes(1);
    expect(TemperatureChanged).toBeCalledWith({ temperature: 8.7, zone: "update temp" });
  })
  test('monitored should fire: TooCold', async () => {
    await t.update(1);
    expect(z.getDailyMin()).toEqual(1);
    expect(TooCold).toBeCalledTimes(1);
    expect(TooCold).toBeCalledWith({ temperature: 6, zone: "update temp" });
  })
  test('monitored should fire: TooWarm', async () => {
    await t.update(12);
    expect(z.getDailyMax()).toEqual(12);
    expect(TooWarm).toBeCalledTimes(1);
    expect(TooWarm).toBeCalledWith({ temperature: 9.7, zone: "update temp" });
  })

  test('disable monitoring', async () => {
    z.setNotMonitored(true);
    TemperatureChanged.mockClear();
    TooCold.mockClear();
    TooWarm.mockClear();
  })

  test('monitored should still fire: TemperatureChanged', async () => {
    await t.update(10);
    expect(z.getTemperature()).toEqual(9);
    expect(TemperatureChanged).toBeCalledTimes(1);
    expect(TemperatureChanged).toBeCalledWith({ temperature: 9, zone: "update temp" });
  })
  test('monitored should not fire: TooCold', async () => {
    await t.update(0);
    expect(TooCold).not.toBeCalled();
  })
  test('monitored should not fire: TooWarm', async () => {
    await t.update(23);
    expect(TooWarm).not.toBeCalled();
  })

  test('re-enable monitoring', async () => {
    z.setNotMonitored(false);
    TemperatureChanged.mockClear();
    TooCold.mockClear();
    TooWarm.mockClear();
  })
  test('monitored should still(!) fire: TemperatureChanged', async () => {
    await t.update(10);
    expect(z.getTemperature()).toEqual(9);
    expect(TemperatureChanged).toBeCalledTimes(1);
    expect(TemperatureChanged).toBeCalledWith({ temperature: 9, zone: "update temp" });
  })
  test('monitored should fire again: TooCold', async () => {
    await t.update(0);
    expect(TooCold).toBeCalledTimes(1);
    expect(TooCold).toBeCalledWith({ temperature: 5.7, zone: "update temp" });
  })
  test('monitored should fire again: TooWarm', async () => {
    await t.update(23);
    expect(TooWarm).toBeCalledTimes(1);
    expect(TooWarm).toBeCalledWith({ temperature: 13.3, zone: "update temp" });
  })
});

describe('device by id', () => {
  const z = makeZone('1', 'device by id');

  beforeAll(async () => {
    await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
    await z.addDevice(makeDevice('2', 'Device 2', 'zone1', 'zone one', '9'));
    await z.addDevice(makeDevice('3', 'Device 3', 'zone1', 'zone one', '7'));
  });

  test('can get a device by id', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.findDevice('1').id).toEqual('1');
    expect(z.findDevice('3').id).toEqual('3');
  });
  test('missing item is undefined', async () => {
    expect((z as any).devices).toHaveLength(3);
    expect(z.findDevice('4')).toBeUndefined();
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

    await z.removeDevice('3');
    await z.removeDevice('1');

    expect((z as any).devices).toHaveLength(1);
    expect(z.getTemperature()).toEqual(9);
  });
});

test('can reset max/min', async () => {
  const z = makeZone('1', 'reset max/min');
  const t = await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
  await t.update(-4);
  await t.update(66);
  await t.update(2);

  expect(z.getTemperature()).toEqual(2);
  expect(z.getDailyMin()).toEqual(-4);
  expect(z.getDailyMax()).toEqual(66);

  z.resetMaxMin();

  expect(z.getTemperature()).toEqual(2);
  expect(z.getDailyMin()).toBeUndefined();
  expect(z.getDailyMax()).toBeUndefined();

  await t.update(4);

  expect(z.getTemperature()).toEqual(4);
  expect(z.getDailyMin()).toEqual(4);
  expect(z.getDailyMax()).toEqual(4);
});



describe('max min notifications works', () => {
  const z = makeZone('1', 'update temp');
  const MaxTemperatureChanged = jest.spyOn((z as any).triggers, 'MaxTemperatureChanged');
  const MinTemperatureChanged = jest.spyOn((z as any).triggers, 'MinTemperatureChanged');
  let t: Thermometer;
  beforeAll(async () => {
    await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
    await z.addDevice(makeDevice('2', 'Device 2', 'zone1', 'zone one', '9'));
    await z.addDevice(makeDevice('3', 'Device 3', 'zone1', 'zone one', '7'));
    t = z.findDevice('3');
  });

  test('setup', () => {
    expect(z.getDailyMax()).toEqual(9);
    expect(z.getDailyMin()).toEqual(7);
    expect(z.getTemperature()).toEqual(8);
    MaxTemperatureChanged.mockClear();
    MinTemperatureChanged.mockClear();
  })
  test('should fire: MinTemperatureChanged', async () => {
    await t.update(1);
    expect(z.getDailyMin()).toEqual(1);
    expect(MinTemperatureChanged).toBeCalledTimes(1);
    expect(MinTemperatureChanged).toBeCalledWith({ temperature: 1, sensor: "Device 3", zone: "update temp" });
    expect(MaxTemperatureChanged).not.toBeCalled();
  })
  test('should fire: MinTemperatureChanged', async () => {
    await t.update(12);
    expect(z.getDailyMax()).toEqual(12);
    expect(MaxTemperatureChanged).toBeCalledTimes(1);
    expect(MaxTemperatureChanged).toBeCalledWith({ temperature: 12, sensor: "Device 3", zone: "update temp" });
    expect(MinTemperatureChanged).toBeCalledTimes(1);
  })
});

test('ignored zones', async () => {
  const z = makeZone('1', 'ignored zone', false, true, []);
  const t = await z.addDevice(makeDevice('1', 'Device 1', 'zone1', 'zone one', '8'));
  expect(z.getTemperature()).toEqual(8);
  await z.setIgnored(true);
  expect(z.getTemperature()).toBeUndefined();
  await t.update(3);
  expect(z.getTemperature()).toBeUndefined();
  await z.setIgnored(false);
  expect(z.getTemperature()).toEqual(3);
});

test('update settings should work', async () => {
  const z = makeZone('1', 'settings update');
  expect((z as any).minAllowed).toBeUndefined();
  expect((z as any).maxAllowed).toBeUndefined();
  z.onUpdateSettings({ minTemperature: 4, maxTemperature: 8 } as ISettings);
  expect((z as any).minAllowed).toEqual(4);
  expect((z as any).maxAllowed).toEqual(8);
  z.onUpdateSettings({ minTemperature: 12, maxTemperature: 17 } as ISettings);
  expect((z as any).minAllowed).toEqual(12);
  expect((z as any).maxAllowed).toEqual(17);
});
