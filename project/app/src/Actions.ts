export interface IActionHandler {
  /**
   * Set the maximum or minimum temperature bounds
   * @param args.type the type of bound to set #dropdown:{"min":"Minimum", "max":"Maximum"}
   * @param args.temperature $common.temperature
   */
  SetTemperatureBounds(args: { type: string; temperature: number }): boolean;
  /**
   * Set the mode for a given zone
   * @param args.zone $common.zone #sample:$common.kitchen
   * @param args.mode mode #dropdown:{"disabled":"Disabled", "enabled":"Enabled", "monitored":"Monitored"}
   */
  SetZoneMode(args: { zone: string; mode: string }): boolean;
}
