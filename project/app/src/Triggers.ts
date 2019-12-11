import Homey from 'homey';

export class Triggers {
    private MaxTemperatureChanged: Homey.FlowCardTrigger;
    private MinTemperatureChanged: Homey.FlowCardTrigger;
    private TemperatureChanged: Homey.FlowCardTrigger;
    private TooCold: Homey.FlowCardTrigger;
    private TooWarm: Homey.FlowCardTrigger;
    private enabled: boolean;

    constructor() {
        this.MaxTemperatureChanged = new Homey.FlowCardTrigger('MaxTemperatureChanged');
        this.MinTemperatureChanged = new Homey.FlowCardTrigger('MinTemperatureChanged');
        this.TemperatureChanged = new Homey.FlowCardTrigger('TemperatureChanged');
        this.TooCold = new Homey.FlowCardTrigger('TooCold');
        this.TooWarm = new Homey.FlowCardTrigger('TooWarm');
        this.enabled = true;
    }

    public register() {
        console.log("Registering triggers");
        this.TemperatureChanged.register();
        this.MaxTemperatureChanged.register();
        this.MinTemperatureChanged.register();
        this.TooCold.register();
        this.TooWarm.register();
    }

    public enable() {
        console.log("Enabling all triggers");
        this.enabled = true;
    }
    public disable() {
        console.log("Disabling all triggers");
        this.enabled = false;
    }


    public async onTempUpdated(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TemperatureChanged.trigger({
            temperature,
            zone,
        });
    }
    public async onMaxUpdated(zone: string, device: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.MaxTemperatureChanged.trigger({
            device,
            temperature,
            zone,
        });
    }
    public async onMinUpdated(zone: string, device: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.MinTemperatureChanged.trigger({
            device,
            temperature,
            zone,
        });
    }
    public async onTooWarm(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TooWarm.trigger({
            temperature,
            zone,
        });
    }
    public async onTooCold(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TooCold.trigger({
            temperature,
            zone,
        });
    }

}