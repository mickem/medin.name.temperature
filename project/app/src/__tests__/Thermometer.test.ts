import { makeDevice, makeZone } from "../TestHelpers";
import { Thermometer } from "../Thermometer";

test('create regular thermometer', () => {
    const z = new Thermometer(makeZone('2345', 'the zone'), makeDevice(), false);
    expect((z as any).id).toEqual('1234');
    expect(z.getName()).toEqual('demo device');
    expect(z.getZone()).toEqual('the zone');
    expect(z.getZoneId()).toEqual('2345');
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
});

test('update temperature should change', async () => {
    const z = new Thermometer(makeZone('2345', 'the zone'), makeDevice(), false);
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
    expect(z.update(12)).toBeTruthy();
    expect((z as any).temp).toEqual(12);
    expect(await z.update(12)).toBeFalsy();
});

test('update with same temperature should not change', async () => {
    const z = new Thermometer(undefined, makeDevice(), false);
    expect(z.hasTemp()).toBeTruthy();
    expect((z as any).temp).toEqual(23.4);
    expect(await z.update(23.4)).toBeFalsy();
    expect((z as any).temp).toEqual(23.4);
});


test('update name', () => {
    const z = new Thermometer(undefined, makeDevice(), false);
    expect(z.getName()).toEqual("demo device");
    z.setName('new name');
    expect(z.getName()).toEqual("new name");
});
test('update zone', () => {
    const z = new Thermometer(makeZone('2', 'the zone'), makeDevice(), false);
    expect(z.getZoneId()).toEqual("2");
    expect(z.getZone()).toEqual("the zone");
    z.setZone(makeZone('4', 'new name'));
    expect(z.getZoneId()).toEqual("4");
    expect(z.getZone()).toEqual("new name");
});
