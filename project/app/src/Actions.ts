import Homey from 'homey';

export interface IActionHandler {
    setMaxTemperature(temperature: number);
    setMinTemperature(temperature: number);

}
export class Actions {
    private handler: IActionHandler;
    private SetMaxTemperature: Homey.FlowCardAction;
    private SetMinTemperature: Homey.FlowCardAction;

    constructor(handler: IActionHandler) {
        this.handler = handler;
        this.SetMaxTemperature = new Homey.FlowCardAction('SetMaxTemperature');
        this.SetMinTemperature = new Homey.FlowCardAction('SetMinTemperature');
    }

    public register() {

        (this.SetMaxTemperature.register() as any).on('run', (args, state, callback) => {
            console.log('TemperatureManager:setMaxTemp' + args);
            this.handler.setMaxTemperature(0);
            callback(null, true);
        });

        (this.SetMinTemperature.register() as any).on('run', (args, state, callback) => {
            console.log('TemperatureManager:SetMinTemperature' + args);
            this.handler.setMinTemperature(0);
            callback(null, true);
        });

    }
};