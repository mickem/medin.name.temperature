import { runInThisContext } from "vm";

export interface IAverageState {
  value: number;
  seconds: number;
  lastUpdate: number;
  lastValue: number;
  lastSensor: string;
  minValue: number;
  maxValue: number;
}

type EventConst = 'max' | 'min';
type EventFunction = (sensor: string, temperature: number) => void;

export default class PeriodAverage {
  public minValue: number | undefined;
  public maxValue: number | undefined;

  private value: number | undefined;
  private seconds: number | undefined;
  private lastUpdate: number | undefined;
  private lastValue: number | undefined;
  private lastSensor: string | undefined;
  private events: {
    max: EventFunction | undefined,
    min: EventFunction | undefined,
  }

  constructor() {
    this.value = undefined;
    this.seconds = undefined;
    this.lastUpdate = undefined;
    this.lastValue = undefined;
    this.minValue = undefined;
    this.maxValue = undefined;
    this.events = { max: undefined, min: undefined };
  }

  public reset() {
    this.minValue = undefined;
    this.maxValue = undefined;
    if (this.lastUpdate === undefined) {
      return;
    }
    this.value = 0;
    this.seconds = 0;
    this.lastUpdate = Date.now();
  }

  public async update(sensor: string, value: number) {
    if (this.minValue === undefined || value < this.minValue) {
      this.minValue = value;
      await this.fire('min', sensor, this.minValue);
    }
    if (this.maxValue === undefined || value > this.maxValue) {
      this.maxValue = value;
      await this.fire('max', sensor, this.maxValue);
    }
    if (this.lastUpdate === undefined || this.lastValue === undefined) {
      this.value = value;
      this.lastValue = value;
      this.lastSensor = sensor;
      this.seconds = 0;
      this.lastUpdate = Date.now();
      return;
    }
    const now = Date.now();
    const delta = now - this.lastUpdate;
    const seconds = Math.round(delta / 1000);
    if (seconds > 1) {
      this.value += this.lastValue * (seconds - 1) + value;
      this.seconds += seconds;
    } else if (seconds === 1) {
      this.value += value;
      this.seconds++;
    } else {
      // No time has passed, do nothing...
    }
    this.lastSensor = sensor;
    this.lastValue = value;
    this.lastUpdate = now;
  }

  public on(event: EventConst, fun: EventFunction) {
    this.events[event] = fun;
  }
  public async fire(event: EventConst, sensor: string, value: number | undefined) {
    if (value !== undefined && this.events[event] !== undefined) {
      await this.events[event](sensor, value);
    }
  }

  public async get(): Promise<number | undefined> {
    if (this.lastValue === undefined || this.value === undefined || this.seconds === undefined) {
      return undefined;
    }
    await this.update(this.lastSensor, this.lastValue);
    if (this.seconds === 0) {
      return Math.round(this.lastValue * 100) / 100;
    }
    return Math.round((this.value / this.seconds) * 100) / 100;
  }

  public getState(): IAverageState | undefined {
    if (!this.lastUpdate || !this.lastValue || !this.seconds || !this.value) {
      return undefined;
    }
    return {
      lastSensor: this.lastSensor,
      lastUpdate: this.lastUpdate,
      lastValue: this.lastValue,
      maxValue: this.maxValue,
      minValue: this.minValue,
      seconds: this.seconds,
      value: this.value,
    };
  }
  public setState(state: IAverageState) {
    if (!state) {
      return;
    }
    this.lastUpdate = state.lastUpdate;
    this.lastValue = state.lastValue;
    this.seconds = state.seconds;
    this.value = state.value;
    if (state.lastSensor) {
      this.lastSensor = state.lastSensor;
    }
    if (state.maxValue) {
      this.maxValue = state.maxValue;
    }
    if (state.minValue) {
      this.minValue = state.minValue;
    }
  }

}
