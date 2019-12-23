import Average from '../helpers/Average';

const RealDate = Date;

beforeAll(() => {
  global.Date.now = jest.fn(() => new Date('2019-12-20T01:01:01Z').getTime());
});

afterAll(() => {
  global.Date = RealDate;
});

describe('test Average', () => {
  const avg = new Average();
  test('test constructor', () => {
    expect((avg as any).value).toBeUndefined();
    expect((avg as any).seconds).toBeUndefined();
    expect((avg as any).lastUpdate).toBeUndefined();
    expect((avg as any).lastValue).toBeUndefined();
    expect(avg.get()).toBeUndefined();
  });

  test('reset on empty should not reset', () => {
    avg.reset();
    expect((avg as any).value).toBeUndefined();
    expect((avg as any).seconds).toBeUndefined();
    expect((avg as any).lastUpdate).toBeUndefined();
    expect((avg as any).lastValue).toBeUndefined();
    expect(avg.get()).toBeUndefined();
  });
  test('set first time (0-time)', () => {
    const avg2 = new Average();
    avg2.update(5);
    expect((avg2 as any).value).toEqual(5);
    expect((avg2 as any).seconds).toEqual(0);
    expect((avg2 as any).lastUpdate).toEqual(1576803661000);
    expect((avg2 as any).lastValue).toEqual(5);
    expect(avg2.get()).toEqual(5);
  });

  test('set first time', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T02:01:01Z').getTime());

    avg.update(10);
    expect((avg as any).value).toEqual(10);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1576807261000);
    expect((avg as any).lastValue).toEqual(10);
    expect(avg.get()).toEqual(10);
  });

  test('set second time', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T03:01:01Z').getTime());

    avg.update(20);
    expect((avg as any).value).toEqual(36020);
    expect((avg as any).seconds).toEqual(3600);
    expect((avg as any).lastUpdate).toEqual(1576810861000);
    expect((avg as any).lastValue).toEqual(20);
    expect(avg.get()).toEqual(10.01);
  });

  test('set third time', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T04:01:01Z').getTime());

    avg.update(30);
    expect((avg as any).value).toEqual(108030);
    expect((avg as any).seconds).toEqual(7200);
    expect((avg as any).lastUpdate).toEqual(1576814461000);
    expect((avg as any).lastValue).toEqual(30);
    expect(avg.get()).toEqual(15);
  });

  test('fetch later', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T05:01:01Z').getTime());

    expect(avg.get()).toEqual(20);
    expect((avg as any).value).toEqual(216030);
    expect((avg as any).seconds).toEqual(10800);
    expect((avg as any).lastUpdate).toEqual(1576818061000);
    expect((avg as any).lastValue).toEqual(30);
    expect(avg.get()).toEqual(20);
  });

  test('can reset', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T06:01:01Z').getTime());

    avg.reset();
    expect((avg as any).value).toEqual(0);
    expect((avg as any).seconds).toEqual(0);
    expect((avg as any).lastUpdate).toEqual(1576821661000);
    expect((avg as any).lastValue).toEqual(30);
    expect(avg.get()).toEqual(30);
  });
  test('one second later works', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T06:01:02Z').getTime());

    avg.update(40);
    expect((avg as any).value).toEqual(40);
    expect((avg as any).seconds).toEqual(1);
    expect((avg as any).lastUpdate).toEqual(1576821662000);
    expect((avg as any).lastValue).toEqual(40);
    expect(avg.get()).toEqual(40);
  });

  test('fetch later still work', () => {
    (global.Date.now as jest.Mock).mockReturnValue(new Date('2019-12-20T07:01:02Z').getTime());

    expect(avg.get()).toEqual(40);
    expect((avg as any).seconds).toEqual(3601);
    expect((avg as any).value).toEqual(40 * 3601);
    expect((avg as any).lastUpdate).toEqual(1576825262000);
    expect((avg as any).lastValue).toEqual(40);
  });
});
