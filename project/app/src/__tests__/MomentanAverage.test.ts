import MomentanAverage from '../helpers/MomentanAverage';

describe('test PeriodAverage', () => {
  const avg = new MomentanAverage();
  const avgMock = jest.fn();
  const minMock = jest.fn();
  const maxMock = jest.fn();
  test('all values should be undefined when created', async () => {
    expect(avg.average).toBeUndefined();
    expect(avg.max).toBeUndefined();
    expect(avg.min).toBeUndefined();
  });

  test('single value should become max and min and average', async () => {
    await avg.update('temp', [{ name: 'a', temp: 5 }]);
    expect(avg.average).toEqual(5);
    expect(avg.min).toEqual(5);
    expect(avg.max).toEqual(5);
  });

  test('max should be the largest value', async () => {
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 7 },
      { name: 'max', temp: 25 },
    ]);
    expect(avg.max).toEqual(25);
  });
  test('min should be the smallest value', async () => {
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 7 },
      { name: 'max', temp: 25 },
    ]);
    expect(avg.min).toEqual(5);
  });
  test('avg shiould be the average value', async () => {
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 7 },
      { name: 'max', temp: 25 },
    ]);
    expect(avg.average).toEqual(12.3);
  });
  test('reset should set values back to undefined', async () => {
    await avg.reset();
    expect(avg.average).toBeUndefined();
    expect(avg.max).toBeUndefined();
    expect(avg.min).toBeUndefined();
  });
  test('should be able to subscribe to average changes', async () => {
    avg.on('avg', avgMock);
    await avg.update('trigger', [{ name: 'temp', temp: 5 }]);
    expect(avgMock).toBeCalledWith('trigger', 5);
  });
  test('if avg does not change event should not fire', async () => {
    avgMock.mockReset();
    await avg.update('temp', [{ name: 'temp', temp: 5 }]);
    expect(avgMock).not.toBeCalled();
  });
  test('max event should fire when max is updated', async () => {
    avg.on('max', maxMock);
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 7 },
      { name: 'max', temp: 25 },
    ]);
    expect(maxMock).toBeCalledWith('max', 25);
  });
  test('max event should not fire if value is the same', async () => {
    maxMock.mockReset();
    avgMock.mockReset();
    avg.on('max', maxMock);
    await avg.update('temp', [
      { name: 'min', temp: 2 },
      { name: 'mid', temp: 1 },
      { name: 'max', temp: 25 },
    ]);
    expect(avgMock).toBeCalled();
    expect(maxMock).not.toBeCalled();
  });
  test('min event should fire when max is updated', async () => {
    avg.on('min', minMock);
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 7 },
      { name: 'max', temp: 25 },
    ]);
    expect(minMock).toBeCalledWith('min', 5);
  });
  test('min event should not fire if value is the same', async () => {
    minMock.mockReset();
    avgMock.mockReset();
    avg.on('min', minMock);
    await avg.update('temp', [
      { name: 'min', temp: 5 },
      { name: 'mid', temp: 11 },
      { name: 'max', temp: 13 },
    ]);
    expect(avgMock).toBeCalled();
    expect(minMock).not.toBeCalled();
  });
});
