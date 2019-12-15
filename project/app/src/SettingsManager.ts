import { IZonesState } from "./Zones";

import Homey from 'homey';

export interface ISettings {
    minTemperature?: number;
    maxTemperature?: number;
    dailyReset?: string;
}
export interface IDeviceConfig {
    devicesIgnored: string[];
    zonesIgnored: string[];
    zonesNotMonitored: string[];
}
export const defaultSettings: ISettings = {
    dailyReset: '02:00',
    maxTemperature: 22,
    minTemperature: 18,
};
const defaultDeviceConfig: IDeviceConfig = {
    devicesIgnored: [],
    zonesIgnored: [],
    zonesNotMonitored: [],
}

export interface IAppState {
    zones: IZonesState;
}

interface ISettingsListener {
    onSettingsUpdated(settings: ISettings): Promise<void>;
    onDeviceConfigUpdated(config: IDeviceConfig): Promise<void>;
    onAppState(state: IAppState);
}

export class SettingsManager {

    private settings: ISettings;
    private deviceConfig: IDeviceConfig;
    private listener: ISettingsListener;

    constructor(listener: ISettingsListener) {
        this.listener = listener;
        this.settings = {
            ...defaultSettings
        };
        this.deviceConfig = {
            ...defaultDeviceConfig
        }
    }


    public async start() {
        this.settings = {
            ...defaultSettings,
            ...Homey.ManagerSettings.get('settings') || (defaultSettings as ISettings)
        };
        await this.listener.onSettingsUpdated(this.settings);
        this.deviceConfig.zonesIgnored = Homey.ManagerSettings.get('zonesIgnored') || [];
        this.deviceConfig.zonesNotMonitored = Homey.ManagerSettings.get('zonesNotMonitored') || [];
        this.deviceConfig.devicesIgnored = Homey.ManagerSettings.get('devicesIgnored') || [];
        await this.listener.onDeviceConfigUpdated(this.deviceConfig);
        this.subscribe();

        const state = Homey.ManagerSettings.get('state') as IAppState;
        if (state) {
            console.log(`Restoring state: `);
            await this.listener.onAppState(state);
        }
    }

    public setState(state: IAppState) {
        Homey.ManagerSettings.set('state', state);
    }

    public getSettings(): ISettings {
        return this.settings;
    }
    public setSettings(settings: ISettings) {
        Homey.ManagerSettings.set('settings', { ...this.settings, ...settings });
    }

    public addZoneMonitored(zoneId: string) {
        this.deviceConfig.zonesNotMonitored = this.removeFromList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
        this.deviceConfig.zonesIgnored = this.removeFromList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
    }
    public addZoneEnabled(zoneId: string) {
        this.deviceConfig.zonesNotMonitored = this.addToList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
        this.deviceConfig.zonesIgnored = this.removeFromList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
    }
    public addZoneDisabled(zoneId: string) {
        this.deviceConfig.zonesIgnored = this.addToList(this.deviceConfig.zonesIgnored, 'zonesIgnored', zoneId);
        this.deviceConfig.zonesNotMonitored = this.addToList(this.deviceConfig.zonesNotMonitored, 'zonesNotMonitored', zoneId);
    }

    private subscribe() {
        (Homey.ManagerSettings as any).on('set', async (variable: string) => {
            try {
                if (variable === 'settings') {
                    const settings = Homey.ManagerSettings.get('settings') as ISettings;
                    console.log(`Allowed temperature span: ${settings.minTemperature} - ${settings.maxTemperature}`);
                    console.log(`Reset max/min running at: ${settings.dailyReset}`);
                    this.settings = { ...settings };
                    await this.listener.onSettingsUpdated(this.settings);
                } else if (variable === 'zonesIgnored') {
                    this.deviceConfig.zonesIgnored = Homey.ManagerSettings.get('zonesIgnored') || [] as string[];
                    await this.listener.onDeviceConfigUpdated(this.deviceConfig);
                } else if (variable === 'zonesNotMonitored') {
                    this.deviceConfig.zonesNotMonitored = Homey.ManagerSettings.get('zonesNotMonitored') || [] as string[];
                    await this.listener.onDeviceConfigUpdated(this.deviceConfig);
                } else if (variable === 'devicesIgnored') {
                    this.deviceConfig.devicesIgnored = Homey.ManagerSettings.get('devicesIgnored') || [] as string[];
                    await this.listener.onDeviceConfigUpdated(this.deviceConfig);
                }
            } catch (error) {
                console.error(`Failed to update settings: ${error}`);
            }
        });
    }


    private removeFromList(list, name, value) {
        const i = list.indexOf(value);
        if (i !== -1) {
            list.splice(i, 1);
            Homey.ManagerSettings.set(name, list);
        }
        return list;
    }
    private addToList(list, name, value) {
        if (list.indexOf(value) === -1) {
            list.push(value);
            Homey.ManagerSettings.set(name, list);
        }
        return list;
    }

}