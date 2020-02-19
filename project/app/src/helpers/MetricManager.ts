import MomentanAverage, { ITemperatureNode } from './MomentanAverage';
import PeriodAverage, { IAverageState } from './PeriodAverage';

type EventConst = 'currentMax' | 'currentMin' | 'currentAvg' | 'underMinBound' | 'overMaxBound';
type EventFunction = (device: string, temperature: number) => void;

export default class MetricManager {
  public period: PeriodAverage;
  public current: MomentanAverage;
  public maxBound: number | undefined;
  public minBound: number | undefined;

  private events: {
    currentAvg: EventFunction | undefined;
    currentMax: EventFunction | undefined;
    currentMin: EventFunction | undefined;
    underMinBound: EventFunction | undefined;
    overMaxBound: EventFunction | undefined;
  };

  constructor() {
    this.events = {
      currentAvg: undefined,
      currentMax: undefined,
      currentMin: undefined,
      overMaxBound: undefined,
      underMinBound: undefined,
    };
    this.period = new PeriodAverage();
    this.current = new MomentanAverage();
    this.maxBound = undefined;
    this.minBound = undefined;
    this.current.on('max', async (sensorName, value) => await this.fire('currentMax', sensorName, value));
    this.current.on('min', async (sensorName, value) => await this.fire('currentMin', sensorName, value));
    this.current.on('avg', async (sensorName, value) => {
      await this.period.update(sensorName, value);
      await this.fire('currentAvg', sensorName, value);

      if (this.maxBound && value > this.maxBound) {
        await this.fire('overMaxBound', sensorName, value);
      } else if (this.minBound && value < this.minBound) {
        await this.fire('underMinBound', sensorName, value);
      }
    });
  }

  public resetPeriod() {
    this.period.reset();
  }

  public getState(): IAverageState | undefined {
    return this.period.getState();
  }
  public setState(state: IAverageState) {
    this.period.setState(state);
  }
  public async update(sensor: string, values: ITemperatureNode[]) {
    await this.current.update(sensor, values);
  }

  public on(event: EventConst, fun: EventFunction) {
    this.events[event] = fun;
  }
  public async fire(event: EventConst, device: string, value: number | undefined) {
    if (value !== undefined && this.events[event] !== undefined) {
      await this.events[event](device, value);
    }
  }
}
