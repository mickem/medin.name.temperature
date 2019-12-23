import { TriggerManager } from '../TriggerManager';

interface ITmp {
  foo(args: { name: string; age: number });
  bar(args);
}

describe('Should work', () => {
  test('can be created', () => {
    const t = new TriggerManager<ITmp>(['foo', 'bar']);
    expect(t).toBeDefined();
    expect(Object.keys((t as any).cards)).toHaveLength(2);
    expect((t as any).cards.foo).toBeDefined();
    expect((t as any).cards.bar).toBeDefined();
  });
  test('Homey errors are handled', () => {
    const t = new TriggerManager<ITmp>(['foo', 'throw', 'bar']);
    expect(t).toBeDefined();
    expect(Object.keys((t as any).cards)).toHaveLength(2);
    expect((t as any).cards.foo).toBeDefined();
    expect((t as any).cards.bar).toBeDefined();
  });
  test('registr registers all cards', () => {
    const tm = new TriggerManager<ITmp>(['foo', 'bar']);
    (tm as any).cards.foo.register = jest.fn();
    (tm as any).cards.bar.register = jest.fn();
    tm.register();
    expect((tm as any).cards.foo.register).toBeCalled();
    expect((tm as any).cards.bar.register).toBeCalled();
  });
});

describe('can trigger cards', () => {
  const handler = {
    Bar: jest.fn().mockReturnValue(false),
    Foo: jest.fn().mockReturnValue(true),
  };
  const tm = new TriggerManager<ITmp>(['foo', 'bar']);
  test('can trigger cards', async () => {
    (tm as any).cards.foo.trigger = jest.fn();
    await tm.get().foo({ name: 'michael', age: 99 });
    expect((tm as any).cards.foo.trigger).toBeCalledWith({ age: 99, name: 'michael' });
  });

  test('cards are not triggerd when disabled', async () => {
    jest.resetAllMocks();
    tm.disable();
    await tm.get().foo({ name: 'michael', age: 99 });
    expect((tm as any).cards.foo.trigger).not.toBeCalled();
  });

  test('cards should trigger when enabled', async () => {
    jest.resetAllMocks();
    tm.enable();
    await tm.get().foo({ name: 'michael', age: 99 });
    expect((tm as any).cards.foo.trigger).toBeCalledWith({ age: 99, name: 'michael' });
  });
});
