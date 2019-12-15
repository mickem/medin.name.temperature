import Homey from 'homey';
import { Catch } from './utils';

export interface ITriggers {
    onTemperatureChanged(zone: string, temperature: number): Promise<void>;
    onMaxTemperatureChanged(zone: string, device: string, temperature: number): Promise<void>;
    onMinTemperatureChanged(zone: string, device: string, temperature: number): Promise<void>;
    onTooWarm(zone: string, temperature: number): Promise<void>;
    onTooCold(zone: string, temperature: number): Promise<void>;
}

export class Triggers implements ITriggers {
    private MaxTemperatureChanged: Homey.FlowCardTrigger;
    private MinTemperatureChanged: Homey.FlowCardTrigger;
    private TemperatureChanged: Homey.FlowCardTrigger;
    private TooCold: Homey.FlowCardTrigger;
    private TooWarm: Homey.FlowCardTrigger;
    private enabled: boolean;

    constructor() {
        try {
            this.MaxTemperatureChanged = new Homey.FlowCardTrigger('MaxTemperatureChanged');
            this.MinTemperatureChanged = new Homey.FlowCardTrigger('MinTemperatureChanged');
            this.TemperatureChanged = new Homey.FlowCardTrigger('TemperatureChanged');
            this.TooCold = new Homey.FlowCardTrigger('TooCold');
            this.TooWarm = new Homey.FlowCardTrigger('TooWarm');
            this.enabled = true;
        } catch (error) {
            console.error(`Failed to register trigger cards: `, error);
        }
    }

    public start() {

    }

    @Catch()
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


    /**
     * A temperature changed
     * @param zone zone #sample:Kitchen
     * @param temperature average temperature #sample:14.5
     */
    public async onTemperatureChanged(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TemperatureChanged.trigger({
            temperature,
            zone,
        });
    }
    /**
     * The temperature is too cold
     * @param zone zone #sample:Kitchen
     * @param temperature temperature #sample:14.5
     */
    public async onTooCold(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TooCold.trigger({
            temperature,
            zone,
        });
    }
    /**
     * The temperature is too warm
     * @param zone zone #sample:Kitchen
     * @param temperature temperature #sample:14.5
     */
    public async onTooWarm(zone: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.TooWarm.trigger({
            temperature,
            zone,
        });
    }
    /**
     * The minimum temperature for a zone changed
     * @param zone zone #sample:Kitchen
     * @param sensor Thermometer #sample:Wall thermometer
     * @param temperature minimum temperature #sample:14.5
     */
    public async onMinTemperatureChanged(zone: string, sensor: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.MinTemperatureChanged.trigger({
            sensor,
            temperature,
            zone,
        });
    }
    /**
     * The maximum temperature for a zone changed
     * @param zone zone #sample:Kitchen
     * @param sensor Thermometer #sample:Wall thermometer
     * @param temperature maximum temperature #sample:14.5
     */
    public async onMaxTemperatureChanged(zone: string, sensor: string, temperature: number): Promise<void> {
        if (!this.enabled) { return; }
        await this.MaxTemperatureChanged.trigger({
            sensor,
            temperature,
            zone,
        });
    }
}