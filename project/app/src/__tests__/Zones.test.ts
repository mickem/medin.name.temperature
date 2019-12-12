import { ISettings } from '../SettingsManager';
import { FakeManager, makeDevice, makeDeviceEx } from "../TestHelpers";
import { Zones } from '../Zones';

test('create zones', () => {
  const manager = new FakeManager();
  const zones = new Zones(manager);
  expect((zones as any).zones).toEqual({});
  expect((zones as any).manager).toEqual(manager);
  expect((zones as any).zonesIgnored).toEqual([]);
  expect((zones as any).zonesNotMonitored).toEqual([]);
  expect((zones as any).devicesIgnored).toEqual([]);
  expect((zones as any).state).toBeUndefined();
  expect((zones as any).settings).toBeUndefined();
});

describe('managing zones', () => {
  const manager = new FakeManager();
  const zones = new Zones(manager);
  test('add zones', () => {
    expect((zones as any).zones).toEqual({});
    zones.addZone("id", "name");
    expect(Object.keys((zones as any).zones)).toEqual(["id"]);
    zones.addZone("another id", "name");
    expect(Object.keys((zones as any).zones)).toEqual(["id", "another id"]);
  })
  test('adding same zone should not yeild duplicates', () => {
    zones.addZone("id", "name");
    expect(Object.keys((zones as any).zones)).toEqual(["id", "another id"]);
    zones.addZone("another id", "name");
    expect(Object.keys((zones as any).zones)).toEqual(["id", "another id"]);
  })
  test('no settings should not be propagates', () => {
    const z = zones.addZone("id", "name");
    expect((z as any).minAllowed).toBeUndefined();
    expect((z as any).maxAllowed).toBeUndefined();
  })
  test('settings should be propagated to old zones', () => {
    zones.onUpdateSettings({ minTemperature: 4, maxTemperature: 8 } as ISettings);
    const z = zones.addZone("id", "new name");
    expect((z as any).minAllowed).toEqual(4);
    expect((z as any).maxAllowed).toEqual(8);
  })
  test('settings should be propagated to new zones', () => {
    zones.onUpdateSettings({ minTemperature: 4, maxTemperature: 8 } as ISettings);
    const z = zones.addZone("new zone", "new name");
    expect((z as any).minAllowed).toEqual(4);
    expect((z as any).maxAllowed).toEqual(8);
  })
  test('getAll should retrieve all zones', () => {
    expect(zones.getAll()).toEqual({
      "another id": { "current": undefined, "devices": [], "devicesIgnored": [], "id": "another id", "ignored": false, "manager": {}, "maxAllowed": 8, "maxSensor": undefined, "maxTemp": undefined, "minAllowed": 4, "minSensor": undefined, "minTemp": undefined, "name": "name", "notMonitored": false }
      , "id": { "current": undefined, "devices": [], "devicesIgnored": [], "id": "id", "ignored": false, "manager": {}, "maxAllowed": 8, "maxSensor": undefined, "maxTemp": undefined, "minAllowed": 4, "minSensor": undefined, "minTemp": undefined, "name": "name", "notMonitored": false }
      , "new zone": { "current": undefined, "devices": [], "devicesIgnored": [], "id": "new zone", "ignored": false, "manager": {}, "maxAllowed": 8, "maxSensor": undefined, "maxTemp": undefined, "minAllowed": 4, "minSensor": undefined, "minTemp": undefined, "name": "new name", "notMonitored": false }
    });
  })
  test('removed zones should be removed', () => {
    zones.removeZone("id");
    expect(Object.keys((zones as any).zones)).toEqual(["another id", "new zone"]);
    zones.removeZone("new zone");
    expect(Object.keys((zones as any).zones)).toEqual(["another id"]);
    zones.removeZone("another id");
    expect(Object.keys((zones as any).zones)).toEqual([]);
  })
})
