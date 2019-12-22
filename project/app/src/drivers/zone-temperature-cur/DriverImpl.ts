import { __, app, Driver } from "homey";
import { ITemperatureManager } from "../../interfaces/ITemperatureManager";

export const capabilities = {
    /**
     * Maximum temperature 
     */
    max: "measure_temperature.max",
    /**
     * Minimum temperature 
     */
    min: "measure_temperature.min",
    /**
     * Current temperature 
     */
    temp: "measure_temperature",
}

/**
 * Virtual thermometer for current values.
 * #class:sensor
 */
export class ZoneAvgTemperatureDriver extends Driver {
    public async onInit() {
        console.info(`Initializing driver`);
    }


    public onPair(socket) {
        const devices = Object.values(this.getTM().getZones()).map(z => ({ name: `${z.getName()} current`, data: { id: z.getId() } }));
        socket.on('list_devices', (data, callback) => {
            socket.emit('list_devices', devices);
            callback(null, devices);
            // callback( new Error('Something bad has occured!') );
        });
    }


    public async onPairListDevices(data: any, callback: (err: Error | null, result: Array<{}>) => void) {
        callback(null, [
            {
                capabilities,
                name: "Device.pair",
            }
        ]
        );
    }

    private getTM(): ITemperatureManager {
        return app.get() as ITemperatureManager;
    }
}
