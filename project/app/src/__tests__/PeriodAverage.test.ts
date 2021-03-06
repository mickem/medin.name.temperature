import PeriodAverage from '../helpers/PeriodAverage';

const RealDate = Date;

beforeAll(() => {
  global.Date.now = jest.fn(() => new Date('2019-12-20T01:01:01Z').getTime());
});

afterAll(() => {
  global.Date = RealDate;
});

describe('test PeriodAverage', () => {
  const avg = new PeriodAverage();
  test('all values should be undefined when created', async () => {
    expect((avg as any).value).toBeUndefined();
    expect((avg as any).seconds).toBeUndefined();
    expect((avg as any).lastUpdate).toBeUndefined();
    expect((avg as any).lastValue).toBeUndefined();
    expect(await avg.get()).toBeUndefined();
  });

  test('reset on empty should not reset values to 0', async () => {
    avg.reset();
    expect((avg as any).value).toBeUndefined();
    expect((avg as any).seconds).toBeUndefined();
    expect((avg as any).lastUpdate).toBeUndefined();
    expect((avg as any).lastValue).toBeUndefined();
    expect(await avg.get()).toBeUndefined();
  });
  test('set first time (0-time)', async () => {
    const avg2 = new PeriodAverage();
    await avg2.update('temp', 5);
    expect((avg2 as any).value).toEqual(5);
    expect((avg2 as any).seconds).toEqual(0);
    expect((avg2 as any).lastUpdate).toEqual(1576803661000);
    expect((avg2 as any).lastValue).toEqual(5);
    expect(await avg2.get()).toEqual(5);
  });

  test('set first time', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T02:01:01Z').getTime());

    await avg.update('temp', 10);
    expect((avg as any).value).toEqual(10);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1576807261000);
    expect((avg as any).lastValue).toEqual(10);
    expect(await avg.get()).toEqual(10);
  });

  test('set second time', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T03:01:01Z').getTime());

    await avg.update('temp', 20);
    expect((avg as any).value).toEqual(36020);
    expect((avg as any).seconds).toEqual(3600);
    expect((avg as any).lastUpdate).toEqual(1576810861000);
    expect((avg as any).lastValue).toEqual(20);
    expect(await avg.get()).toEqual(10.01);
  });

  test('set third time', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T04:01:01Z').getTime());

    await avg.update('temp', 30);
    expect((avg as any).value).toEqual(108030);
    expect((avg as any).seconds).toEqual(7200);
    expect((avg as any).lastUpdate).toEqual(1576814461000);
    expect((avg as any).lastValue).toEqual(30);
    expect(await avg.get()).toEqual(15);
  });

  test('fetch later', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T05:01:01Z').getTime());

    expect(await avg.get()).toEqual(20);
    expect((avg as any).value).toEqual(216030);
    expect((avg as any).seconds).toEqual(10800);
    expect((avg as any).lastUpdate).toEqual(1576818061000);
    expect((avg as any).lastValue).toEqual(30);
    expect(await avg.get()).toEqual(20);
  });

  test('can reset', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T06:01:01Z').getTime());

    avg.reset();
    expect((avg as any).value).toEqual(0);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1576821661000);
    expect((avg as any).lastValue).toEqual(30);
    expect(await avg.get()).toEqual(30);
  });
  test('one second later works', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T06:01:02Z').getTime());

    await avg.update('temp', 40);
    expect((avg as any).value).toEqual(40);
    expect((avg as any).seconds).toEqual(1);
    expect((avg as any).lastUpdate).toEqual(1576821662000);
    expect((avg as any).lastValue).toEqual(40);
    expect(await avg.get()).toEqual(40);
  });

  test('fetch later still work', async () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T07:01:02Z').getTime());

    expect(await avg.get()).toEqual(40);
    expect((avg as any).seconds).toEqual(3601);
    expect((avg as any).value).toEqual(40 * 3601);
    expect((avg as any).lastUpdate).toEqual(1576825262000);
    expect((avg as any).lastValue).toEqual(40);
  });
  test('We should be able to get state', () => {
    expect(avg.getState()).toEqual({
      lastSensor: 'temp',
      lastUpdate: 1576825262000,
      lastValue: 40,
      maxValue: 40,
      minValue: 30,
      seconds: 3601,
      value: 144040,
    });
  });
  test('Setting state should update values', async () => {
    avg.reset();
    expect((avg as any).value).toEqual(0);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1576825262000);
    expect((avg as any).lastValue).toEqual(40);
    expect((avg as any).lastSensor).toEqual('temp');
    expect(await avg.get()).toEqual(40);

    avg.setState({
      lastSensor: 'sesns',
      lastUpdate: 1576825262000,
      lastValue: 20,
      maxValue: 30,
      minValue: 10,
      seconds: 3601,
      value: 144040,
    });

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T07:01:02Z').getTime());

    expect(await avg.get()).toEqual(40);
    expect((avg as any).seconds).toEqual(3601);
    expect((avg as any).value).toEqual(40 * 3601);
    expect((avg as any).lastUpdate).toEqual(1576825262000);
    expect((avg as any).lastValue).toEqual(20);
  });
  test('Undefined state should be ignored', async () => {
    avg.setState(undefined);
  });

  const mockMax = jest.fn();
  test('Max event should fire when value changes', async () => {
    avg.on('max', mockMax);
    await avg.update('temp', 50);
    expect(mockMax).toBeCalledWith('temp', 50);
  });
  test('Max event should not fire when value is same', async () => {
    mockMax.mockClear();
    await avg.update('temp', -5);
    expect(mockMax).not.toBeCalled();
  });
  const mockMin = jest.fn();
  test('Min event should fire when value changes', async () => {
    avg.on('min', mockMin);
    await avg.update('temp', -10);
    expect(mockMin).toBeCalledWith('temp', -10);
  });
  test('Min event should not fire when value is same', async () => {
    mockMin.mockClear();
    await avg.update('temp', 60);

    expect(mockMin).not.toBeCalled();
  });

  test('system test', async () => {
    await avg.update('dummy', 10);
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:00Z').getTime());
    avg.reset();
    expect((avg as any).value).toEqual(0);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1546304400000);
    expect((avg as any).lastValue).toEqual(10);
    expect((avg as any).lastSensor).toEqual('dummy');
    expect(await avg.get()).toEqual(10);

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:10Z').getTime());
    expect((avg as any).value).toEqual(0);
    await avg.update('dummy', 15);
    expect((avg as any).value).toEqual(105); // 9s x 10 + 1s x 15 = 105
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:20Z').getTime());
    await avg.update('dummy', 10);
    expect((avg as any).value).toEqual(250); // 105 + 9s x 15  + 1s x 10 = 250

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:30Z').getTime());
    expect(await avg.get()).toEqual(11.67);
    expect((avg as any).value).toEqual(350); // 250 + 10s x 10 = 350
    expect((avg as any).seconds).toEqual(30);

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:40Z').getTime());
    await avg.update('dummy', 20);
    expect((avg as any).value).toEqual(460); // 350 + 9s x 10 + 1s x 20 = 460
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:00:50Z').getTime());
    await avg.update('dummy', 10);
    expect((avg as any).value).toEqual(650); // 460 + 9s x 20 + 1s x 10 = 650

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:01:00Z').getTime());

    expect(await avg.get()).toEqual(12.5);
    expect((avg as any).value).toEqual(750); // 650 + 10s x 10 = 750
    expect((avg as any).seconds).toEqual(60);

    const state = avg.getState();

    const avg2 = new PeriodAverage();
    avg2.setState(state);
    expect(await avg2.get()).toEqual(12.5);
    expect((avg2 as any).value).toEqual(750);
    expect((avg2 as any).seconds).toEqual(60);

    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-01-01T01:02:00Z').getTime());

    expect(await avg2.get()).toEqual(11.25);
    expect((avg2 as any).value).toEqual(1350); // 750 + 60s x 10 = 1350
    expect((avg2 as any).seconds).toEqual(120);

    const avg3 = new PeriodAverage();
    avg3.setState(state);
    expect(await avg3.get()).toEqual(11.25);
    expect((avg3 as any).value).toEqual(1350); // 750 + 60s x 10 = 1350
    expect((avg3 as any).seconds).toEqual(120);
  });
});
