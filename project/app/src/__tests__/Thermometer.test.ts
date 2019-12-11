import { IDeviceType } from "../interfaces/IDeviceType";
import { makeDevice } from "../TestHelpers";
import { Thermometer } from "../Thermometer";

test('create regular thermometer', () => {
    const z = new Thermometer(makeDevice(), false);
    expect((z as any).id).toEqual('1234');
    expect(z.getName()).toEqual('demo device');
    expect(z.getZone()).toEqual('the zone');
    expect(z.getZoneId()).toEqual('2345');
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
});

test('update temperature should change', () => {
    const z = new Thermometer(makeDevice(), false);
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
    expect(z.update(12)).toBeTruthy();
    expect((z as any).temp).toEqual(12);
});

test('update with same temperature should not change', () => {
    const z = new Thermometer(makeDevice(), false);
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
    expect(z.update(23.4)).toBeFalsy();
    expect((z as any).temp).toEqual(23.4);
});


test('update name', () => {
    const z = new Thermometer(makeDevice(), false);
    expect(z.getName()).toEqual("demo device");
    z.setName('new name');
    expect(z.getName()).toEqual("new name");
});
test('update zone', () => {
    const z = new Thermometer(makeDevice(), false);
    expect(z.getZoneId()).toEqual("2345");
    expect(z.getZone()).toEqual("the zone");
    z.setZone('4', 'new name');
    expect(z.getZoneId()).toEqual("4");
    expect(z.getZone()).toEqual("new name");
});
