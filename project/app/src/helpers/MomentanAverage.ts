
type EventConst = 'max' | 'min' | 'avg';
type EventFunction = (device: string, temperature: number) => void;
export interface ITemperatureNode {
  name: string;
  temp: number;
}

export default class MomentanAverage {
  public max: number;
  public min: number;
  public average: number;

  private events: {
    avg: EventFunction | undefined,
    max: EventFunction | undefined,
    min: EventFunction | undefined,
  }

  constructor() {
    this.events = { max: undefined, min: undefined, avg: undefined };
  }

  public on(event: EventConst, fun: EventFunction) {
    this.events[event] = fun;
  }
  public async fire(event: EventConst, device: string, value: number | undefined) {
    if (value !== undefined && this.events[event] !== undefined) {
      await this.events[event](device, value);
    }
  }

  public reset() {
    this.min = undefined;
    this.max = undefined;
    this.average = undefined;
  }

  public async update(sensor: string, values: ITemperatureNode[]) {
    if (values.length === 0) {
      this.reset();
      return;
    }
    const largest = values.reduce((p, c) => p === undefined || c.temp > p.temp ? c : p, undefined);
    if (largest.temp !== this.max) {
      this.max = largest.temp;
      await this.fire('max', largest.name, this.max);
    }
    const smallest = values.reduce((p, c) => p === undefined || c.temp < p.temp ? c : p, undefined);
    if (smallest.temp !== this.min) {
      this.min = smallest.temp;
      await this.fire('min', smallest.name, this.min);
    }

    const sum = values.reduce((s, c) => s + c.temp, 0);
    const avg = Math.round((sum / values.length) * 10) / 10;
    if (this.average !== avg) {
      this.average = avg;
      await this.fire('avg', sensor, this.average);
    }
  }


}