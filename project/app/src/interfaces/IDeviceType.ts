export interface IDeviceCapabilityType {
  id: string
  value: any;
}
export interface IDeviceCapabilityTypeList {
  [key: string]: IDeviceCapabilityType;
}
export interface IDeviceType {
  id: string;
  name: string;
  zone: string,
  zoneName: string,
  iconObj: {
    id: string,
    url: string,
  }

  capabilitiesObj: IDeviceCapabilityTypeList,


  /*
   * @property { string } driverUri
   * @property { string } driverId
   * @property { object } data
   * @property { string } icon
   * @property { object } iconObj
   * @property { string } iconObj.id
   * @property { string } iconObj.url
   * @property { object } settings
   * @property { boolean } settingsObj This property is true when there are settings, getable by the getDeviceSettingsObj method
   * @property { string } class
   * @property { object } energy
   * @property { object } energy.approximation
   * @property { number } energy.approximation.usageOn
   * @property { number } energy.approximation.usageOff
   * @property { number } energy.approximation.usageConstant
   * @property { boolean } energy.cumulative
   * @property { string[] } energy.batteries
   * @property { object } energyObj
   * @property { object } virtualClass
   * @property { object } ui
   * @property { string } ui.quickAction Optional capabilityId of the quick action
   * @property { object[] } ui.components
   * @property { string } ui.components.id ID of the UI component
   * @property { string[] } ui.components.capabilities An array of capabilityIds
   * @property { string[] } capabilities
   * @property { Object.<string, object> } capabilitiesObj
   * @property { string } capabilitiesObj.[key].id
   * @property { string } capabilitiesObj.[key].uri
   * @property { string } capabilitiesObj.[key].title
   * @property { string } capabilitiesObj.[key].desc
   * @property { string } capabilitiesObj.[key].type  ("boolean" | "number" | "string" | "enum")
   * @property { boolean } capabilitiesObj.[key].getable
   * @property { boolean } capabilitiesObj.[key].setable
   * @property { string } capabilitiesObj.[key].chartType  ("line" | "area" | "stepLine" | "column" | "spline" | "splineArea" | "scatter")
   * @property { number } capabilitiesObj.[key].decimals
   * @property { number } capabilitiesObj.[key].min
   * @property { number } capabilitiesObj.[key].max
   * @property { number } capabilitiesObj.[key].step
   * @property { string } capabilitiesObj.[key].units
   * @property { object[] } capabilitiesObj.[key].values
   * @property { string } capabilitiesObj.[key].values.id
   * @property { string } capabilitiesObj.[key].values.title
   * @property { string } capabilitiesObj.[key].lastUpdated
   * @property { object } capabilitiesObj.[key].options
   * @property { object } capabilitiesOptions
   * @property { string[] } flags
   * */
  ready: boolean;
}

export interface IDeviceList {
  [key: string]: IDeviceType;
}