export interface IAverageState {
  value: number;
  seconds: number;
  lastUpdate;
  lastValue;
}

export default class Average {
  private value: number | undefined;
  private seconds: number | undefined;
  private lastUpdate: number | undefined;
  private lastValue: number | undefined;

  constructor() {
    this.value = undefined;
    this.seconds = undefined;
    this.lastUpdate = undefined;
    this.lastValue = undefined;
  }

  public reset() {
    if (this.lastUpdate === undefined) {
      return;
    }
    this.value = 0;
    this.seconds = 0;
    this.lastUpdate = Date.now();
  }

  public update(value: number) {
    if (this.lastUpdate === undefined || this.lastValue === undefined) {
      this.value = value;
      this.lastValue = value;
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
    this.lastValue = value;
    this.lastUpdate = now;
  }

  public get(): number | undefined {
    if (this.lastValue === undefined || this.value === undefined || this.seconds === undefined) {
      return undefined;
    }
    this.update(this.lastValue);
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
      lastUpdate: this.lastUpdate,
      lastValue: this.lastValue,
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
  }
}
