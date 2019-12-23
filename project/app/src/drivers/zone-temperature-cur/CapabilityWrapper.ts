import { Device } from 'homey';

interface ILocaleString {
  [key: string]: string;
}

interface IOptions {
  title: ILocaleString;
}

export class CapabilityWrapper {
  private handler: Device;
  private name: string;
  private lastValue: string | number | undefined;
  constructor(handler: Device, name: string) {
    this.handler = handler;
    this.name = name;
  }

  public async set(value: string | number) {
    try {
      if (value === undefined) {
        return;
      }
      if (this.lastValue === undefined || this.lastValue !== value) {
        this.lastValue = value;
        console.log(`Updating ${this.name} to ${value}`);
        await this.handler.setCapabilityValue(this.name, value);
      }
    } catch (error) {
      console.error(`Failed to update ${this.name}: ${error}`, error);
    }
  }

  public async setOptions(data: IOptions) {
    await this.handler.setCapabilityOptions(this.name, data);
  }
}
