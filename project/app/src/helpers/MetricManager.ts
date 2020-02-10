import MomentanAverage, { ITemperatureNode } from './MomentanAverage';
import PeriodAverage, { IAverageState } from './PeriodAverage';

type EventConst = 'currentMax' | 'currentMin' | 'currentAvg';
type EventFunction = (device: string, temperature: number) => void;

export default class MetricManager {
  public period: PeriodAverage;
  public current: MomentanAverage;

  private events: {
    currentAvg: EventFunction | undefined;
    currentMax: EventFunction | undefined;
    currentMin: EventFunction | undefined;
  };

  constructor() {
    this.events = { currentMax: undefined, currentMin: undefined, currentAvg: undefined };
    this.period = new PeriodAverage();
    this.current = new MomentanAverage();
    this.current.on('max', async (sensorName, value) => await this.fire('currentMax', sensorName, value));
    this.current.on('min', async (sensorName, value) => await this.fire('currentMin', sensorName, value));
    this.current.on('avg', async (sensorName, value) => {
      await this.period.update(sensorName, value);
      await this.fire('currentAvg', sensorName, value);
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
