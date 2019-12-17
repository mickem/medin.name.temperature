export interface ITriggers {
  /**
   * A temperature changed
   * @param args.zone zone #sample:Kitchen
   * @param args.temperature average temperature #sample:14.5
   */
  TemperatureChanged(args: { zone: string, temperature: number }): Promise<void>;

  /**
   * The temperature is too cold
   * @param args.zone zone #sample:Kitchen
   * @param args.temperature temperature #sample:14.5
   */
  TooCold(args: { zone: string, temperature: number }): Promise<void>;
  /**
   * The temperature is too warm
   * @param args.zone zone #sample:Kitchen
   * @param args.temperature temperature #sample:14.5
   */
  TooWarm(args: { zone: string, temperature: number }): Promise<void>;
  /**
   * The minimum temperature for a zone changed
   * @param args.zone zone #sample:Kitchen
   * @param args.sensor Thermometer #sample:Wall thermometer
   * @param args.temperature minimum temperature #sample:14.5
   */
  MinTemperatureChanged(args: { zone: string, sensor: string, temperature: number }): Promise<void>;
  /**
   * The maximum temperature for a zone changed
   * @param args.zone zone #sample:Kitchen
   * @param args.sensor Thermometer #sample:Wall thermometer
   * @param args.temperature maximum temperature #sample:14.5
   */
  MaxTemperatureChanged(args: { zone: string, sensor: string, temperature: number }): Promise<void>;


}
