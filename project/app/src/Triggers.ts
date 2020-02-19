export interface ITriggers {
  /**
   * The temperature changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.temperature $common.averageTemperature #sample:14.5
   */
  TemperatureChanged(args: { zone: string; temperature: number }): Promise<void>;

  /**
   * The temperature is too cold
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.temperature $common.temperature #sample:14.5
   */
  TooCold(args: { zone: string; temperature: number }): Promise<void>;
  /**
   * The temperature is too warm
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.temperature $common.temperature #sample:14.5
   */
  TooWarm(args: { zone: string; temperature: number }): Promise<void>;
  /**
   * The minimum temperature for a zone changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.sensor $common.thermometer #sample:$common.sampleTempDevice
   * @param args.temperature minimum temperature #sample:14.5
   */
  MinTemperatureChanged(args: { zone: string; sensor: string; temperature: number }): Promise<void>;
  /**
   * The maximum temperature for a zone changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.sensor $common.thermometer #sample:$common.sampleTempDevice
   * @param args.temperature maximum temperature #sample:14.5
   */
  MaxTemperatureChanged(args: { zone: string; sensor: string; temperature: number }): Promise<void>;

  /**
   * The humidity changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.humidity $common.averageTemperature #sample:14.5
   */
  HumidityChanged(args: { zone: string; humidity: number }): Promise<void>;

  /**
   * The humidity is too dry
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.humidity $common.humidity #sample:14.5
   */
  TooDry(args: { zone: string; humidity: number }): Promise<void>;
  /**
   * The humidity is too wet
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.humidity $common.humidity #sample:14.5
   */
  TooHumid(args: { zone: string; humidity: number }): Promise<void>;
  /**
   * The minimum humidity for a zone changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.sensor $common.hygrometer #sample:$common.sampleTempDevice
   * @param args.humidity minimum humidity #sample:14.5
   */
  MinHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void>;
  /**
   * The maximum humidity for a zone changed
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.sensor $common.hygrometer #sample:$common.sampleTempDevice
   * @param args.humidity maximum humidity #sample:14.5
   */
  MaxHumidityChanged(args: { zone: string; sensor: string; humidity: number }): Promise<void>;
}
