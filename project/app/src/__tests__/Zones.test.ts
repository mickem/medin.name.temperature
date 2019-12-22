import { ISettings } from '../SettingsManager';
import { makeDevice, makeZones } from '../TestHelpers';

test('create zones', () => {
  const zones = makeZones();
  expect((zones as any).zones).toEqual({});
  expect((zones as any).zonesIgnored).toEqual([]);
  expect((zones as any).zonesNotMonitored).toEqual([]);
  expect((zones as any).devicesIgnored).toEqual([]);
  expect((zones as any).state).toBeUndefined();
  expect((zones as any).settings).toBeUndefined();
});

describe('managing zones', () => {
  const zones = makeZones();
  test('add zones', () => {
    expect((zones as any).zones).toEqual({});
    zones.addZone('id', 'zone 1');
    expect(Object.keys((zones as any).zones)).toEqual(['id']);
    zones.addZone('another id', 'zone 2');
    expect(Object.keys((zones as any).zones)).toEqual(['id', 'another id']);
  });
  test('adding same zone should not yeild duplicates', () => {
    zones.addZone('id', 'not used');
    expect(Object.keys((zones as any).zones)).toEqual(['id', 'another id']);
    zones.addZone('another id', 'not used');
    expect(Object.keys((zones as any).zones)).toEqual(['id', 'another id']);
  });
  test('no settings should not be propagates', () => {
    const z = zones.addZone('id', 'not used');
    expect((z as any).minAllowed).toBeUndefined();
    expect((z as any).maxAllowed).toBeUndefined();
  });
  test('settings should be propagated to old zones', () => {
    zones.onUpdateSettings({ minTemperature: 4, maxTemperature: 8 } as ISettings);
    const z = zones.addZone('id', 'new name');
    expect((z as any).minAllowed).toEqual(4);
    expect((z as any).maxAllowed).toEqual(8);
  });
  test('settings should be propagated to new zones', () => {
    zones.onUpdateSettings({ minTemperature: 4, maxTemperature: 8 } as ISettings);
    const z = zones.addZone('new zone', 'new name');
    expect((z as any).minAllowed).toEqual(4);
    expect((z as any).maxAllowed).toEqual(8);
  });
  test('getAll should retrieve all zones', () => {
    expect(Object.keys(zones.getAll())).toEqual(['id', 'another id', 'new zone']);
  });
  test('add some devices', async () => {
    await zones.addDevice(makeDevice('id1', 'test 1', 'id', 'zone 1'));
    await zones.addDevice(makeDevice('id2', 'test 2', 'id', 'zone 1'));
    await zones.addDevice(makeDevice('id3', 'test 3', 'another id', 'zone 2'));
    await zones.addDevice(makeDevice('id4', 'test 3', 'another id', 'zone 2'));
    expect(Object.keys(zones.getAll())).toContain('id');
    expect(zones.getAll().id).toHaveProperty('devices');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual(['id1', 'id2']);
    expect(Object.keys(zones.getAll())).toContain('another id');
    expect(zones.getAll()['another id']).toHaveProperty('devices');
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual(['id3', 'id4']);
  });
  test('find added devices', async () => {
    expect(zones.findDevice('id1')).toBeDefined();
    expect(zones.findDevice('id2')).toBeDefined();
    expect(zones.findDevice('id3')).toBeDefined();
    expect(zones.findDevice('id4')).toBeDefined();
    expect(zones.findDevice('id1').getZoneId()).toEqual('id');
    expect(zones.findDevice('id2').getZoneId()).toEqual('id');
    expect(zones.findDevice('id3').getZoneId()).toEqual('another id');
    expect(zones.findDevice('id4').getZoneId()).toEqual('another id');
  });
  test('missing device should return undefined', async () => {
    expect(zones.findDevice('missing')).toBeUndefined();
  });

  test('move devices should be moved', async () => {
    const t1 = zones.findDevice('id1');
    const t2 = zones.findDevice('id4');
    expect(Object.keys(zones.getAll())).toContain('id');
    expect(zones.getAll().id).toHaveProperty('devices');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual(['id1', 'id2']);
    expect(Object.keys(zones.getAll())).toContain('another id');
    expect(zones.getAll()['another id']).toHaveProperty('devices');
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual(['id3', 'id4']);
    await zones.moveDevice(t1, 'id', 'another id', 'The new name');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual(['id2']);
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual(['id3', 'id4', 'id1']);
    await zones.moveDevice(t2, 'another id', 'id', 'The new name');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual(['id2', 'id4']);
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual(['id3', 'id1']);
  });
  test('removed devices', async () => {
    await zones.removeDeviceById('id2');
    await zones.removeDeviceById('id1');
    expect(zones.getAll().id).toHaveProperty('devices');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual(['id4']);
    expect(zones.getAll()['another id']).toHaveProperty('devices');
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual(['id3']);
    await zones.removeDeviceById('id3');
    await zones.removeDeviceById('id4');
    expect((zones.getAll().id as any).devices.map(d => d.id)).toEqual([]);
    expect((zones.getAll()['another id'] as any).devices.map(d => d.id)).toEqual([]);
  });
  test('removed zones should be removed', () => {
    zones.removeZone('id');
    expect(Object.keys((zones as any).zones)).toEqual(['another id', 'new zone']);
    zones.removeZone('new zone');
    expect(Object.keys((zones as any).zones)).toEqual(['another id']);
    zones.removeZone('another id');
    expect(Object.keys((zones as any).zones)).toEqual([]);
  });
});
test('reset maxmin should reset max and min', async () => {
  const zones = makeZones();
  const z = zones.addZone('id', 'name');
  const t1 = await z.addDevice(makeDevice());
  const t2 = await z.addDevice(makeDevice('dev 2', 'demo device', '2345', 'the zone', '3.4'));
  const t3 = await z.addDevice(makeDevice('dev 3', 'demo device', '2345', 'the zone', '7.9'));
  expect(z.getDailyMin()).toEqual(3.4);
  expect(z.getDailyMax()).toEqual(23.4);
  zones.resetMaxMin();
  expect(z.getDailyMin()).toBeUndefined();
  expect(z.getDailyMax()).toBeUndefined();
  await t2.update(45);
  expect(z.getDailyMin()).toEqual(45);
  expect(z.getDailyMax()).toEqual(45);
  await t2.update(22);
  expect(z.getDailyMin()).toEqual(22);
  expect(z.getDailyMax()).toEqual(45);
  await t3.update(-2);
  expect(z.getDailyMin()).toEqual(-2);
  expect(z.getDailyMax()).toEqual(45);
  await t1.update(99);
  expect(z.getDailyMin()).toEqual(-2);
  expect(z.getDailyMax()).toEqual(99);
  zones.resetMaxMin();
  expect(z.getDailyMin()).toBeUndefined();
  expect(z.getDailyMax()).toBeUndefined();
});
