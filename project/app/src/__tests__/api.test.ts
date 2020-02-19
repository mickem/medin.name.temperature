import Homey from 'homey';
import { makeDeviceEx, makeZone } from '../TestHelpers';
jest.mock('Homey');

import * as api from '../api';
import { Thermometer } from '../Thermometer';
import { Zone } from '../Zone';

const makeTherm = (id, name, zoneId, zoneName, temp, battery = 80) =>
  new Thermometer(
    { getId: () => zoneId, getName: () => zoneName } as Zone,
    makeDeviceEx(id, name, zoneId, zoneName, temp, battery),
    false,
  );

async function mkZoneWithDevice(id: string, name: string, temp: number) {
  const zone = makeZone(id, name);
  await zone.addDevice(makeDeviceEx('a', 'a', 'zb', 'zb', temp));
  return zone;
}
describe('Test API', () => {
  const instance = {
    getDevices: jest.fn().mockReturnValue([]),
    getLogs: jest.fn().mockImplementation(() => []),
    getZones: jest.fn().mockImplementation(() => ({})),
  };
  (Homey.app as any).set(instance);
  describe('GET /devices', () => {
    const curApi = api[0];
    test('Ensure API exists', () => {
      expect(curApi.method).toEqual('GET');
      expect(curApi.path).toEqual('/devices');
      expect(curApi.description).toBeDefined();
    });
    test('APi should return empty list if there are no devices', done => {
      function callback(headers, data) {
        try {
          expect(data).toEqual([]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should formatted thermometer data', done => {
      instance.getDevices = jest.fn().mockReturnValue([makeTherm('ID', 'NAME', 'zone', 'zoneName', 22)]);

      function callback(headers, data) {
        try {
          expect(data).toEqual([
            {
              battery: 80,
              humidity: '?',
              icon: 'n/a',
              id: 'ID',
              name: 'NAME',
              temperature: 22,
              zone: 'zone',
              zoneName: 'zoneName',
            },
          ]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should handle multiple thermometers', done => {
      instance.getDevices = jest
        .fn()
        .mockReturnValue([
          makeTherm('a', 'NAME', 'zone', 'zoneName', 11),
          makeTherm('b', 'NAME', 'zone', 'zoneName', 22),
          makeTherm('c', 'NAME', 'zone', 'zoneName', 33),
        ]);

      function callback(headers, data) {
        try {
          expect(data.map(d => ({ id: d.id, temperature: d.temperature }))).toEqual([
            {
              id: 'a',
              temperature: 11,
            },
            {
              id: 'b',
              temperature: 22,
            },
            {
              id: 'c',
              temperature: 33,
            },
          ]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should sort devices by zoneName and name', done => {
      instance.getDevices = jest
        .fn()
        .mockReturnValue([
          makeTherm('a', 'a', 'zb', 'zb', 33),
          makeTherm('b', 'b', 'zb', 'zb', 44),
          makeTherm('d', 'd', 'za', 'za', 22),
          makeTherm('c', 'c', 'za', 'za', 11),
        ]);

      function callback(headers, data) {
        try {
          expect(data.map(d => `${d.zoneName}: ${d.name}`)).toEqual(['za: c', 'za: d', 'zb: a', 'zb: b']);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
  });

  describe('GET /zones', () => {
    const curApi = api[1];
    test('Ensure API exists', () => {
      expect(curApi.method).toEqual('GET');
      expect(curApi.path).toEqual('/zones');
      expect(curApi.description).toBeDefined();
    });
    test('APi should return empty list if there are no zones', done => {
      function callback(headers, data) {
        try {
          expect(data).toEqual([]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('API should return formatted zone data', async done => {
      const zones = {
        a: await mkZoneWithDevice('1234', 'demo zone', 33),
      };
      instance.getZones = jest.fn().mockImplementation(() => zones);

      function callback(headers, data) {
        try {
          expect(data).toEqual([
            {
              humidity: {
                active: false,
                currentAvg: undefined,
                currentMax: undefined,
                currentMin: undefined,
                periodAvg: undefined,
                periodMax: undefined,
                periodMin: undefined,
              },
              icon: 'unknown',
              id: '1234',
              name: 'demo zone',
              temperature: {
                active: true,
                currentAvg: 33,
                currentMax: 33,
                currentMin: 33,
                periodAvg: 33,
                periodMax: 33,
                periodMin: 33,
              },
            },
          ]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should handle multiple thermometers', async done => {
      const zones = {
        a: await mkZoneWithDevice('za', 'zone a', 11),
        b: await mkZoneWithDevice('zb', 'zone b', 22),
        c: await mkZoneWithDevice('zc', 'zone c', 33),
      };
      instance.getZones = jest.fn().mockImplementation(() => zones);

      function callback(headers, data) {
        try {
          expect(data.map(d => ({ id: d.id, currentAvg: d.temperature.currentAvg }))).toEqual([
            {
              currentAvg: 11,
              id: 'za',
            },
            {
              currentAvg: 22,
              id: 'zb',
            },
            {
              currentAvg: 33,
              id: 'zc',
            },
          ]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should only return zones with thermometers', async done => {
      const zones = {
        a: await mkZoneWithDevice('za', 'zone a', 11),
        b: await mkZoneWithDevice('zb', 'zone b', 22),
        c: await mkZoneWithDevice('zc', 'zone c', 33),
        d: makeZone('empty', 'empty'),
      };
      instance.getZones = jest.fn().mockImplementation(() => zones);

      function callback(headers, data) {
        try {
          expect(data.map(d => d.id)).toEqual(['za', 'zb', 'zc']);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('APi should sort devices by zoneName', async done => {
      const zones = {
        a: await mkZoneWithDevice('za', 'zone c', 11),
        b: await mkZoneWithDevice('zb', 'zone b', 22),
        c: await mkZoneWithDevice('zc', 'zone a', 33),
      };
      instance.getZones = jest.fn().mockImplementation(() => zones);

      function callback(headers, data) {
        try {
          expect(data.map(d => d.name)).toEqual(['zone a', 'zone b', 'zone c']);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
  });

  describe('GET /logs', () => {
    const curApi = api[2];
    test('Ensure API exists', () => {
      expect(curApi.method).toEqual('GET');
      expect(curApi.path).toEqual('/logs');
      expect(curApi.description).toBeDefined();
    });
    test('API should return empty list if there are no logs', done => {
      function callback(headers, data) {
        try {
          expect(data).toEqual([]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('API should return formatted log data', async done => {
      const date = new Date();
      instance.getLogs = jest.fn().mockImplementation(() => [{ date, level: 'error', message: 'Hello World' }]);

      function callback(headers, data) {
        try {
          expect(data).toEqual([
            {
              date: date.toISOString(),
              level: 'error',
              message: 'Hello World',
            },
          ]);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
    test('API should handle multiple messages', async done => {
      const date = new Date();
      instance.getLogs = jest.fn().mockImplementation(() => [
        { date, level: 'error', message: 'Hello World 1' },
        { date, level: 'error', message: 'Hello World 2' },
        { date, level: 'error', message: 'Hello World 3' },
        { date, level: 'error', message: 'Hello World 4' },
      ]);

      function callback(headers, data) {
        try {
          expect(data).toHaveLength(4);
          done();
        } catch (error) {
          done(error);
        }
      }
      curApi.fn({}, callback);
    });
  });
});
