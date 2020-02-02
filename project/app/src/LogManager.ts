export interface ILogMessage {
    date: Date;
    level: 'debug' | 'ok' | 'error';
    message: string;
}

const logs: ILogMessage[] = [];
let logEnabled: boolean = true;

function logRaw(level: 'debug' | 'ok' | 'error', message:string) {
    if (!logEnabled) {
        return;
    }
    logs.push( {
        date: new Date(),
        level,
        message,
    })
    if (logs.length > 100) {
        logs.unshift();
    }
}
export function log(message: string) {
    logRaw('ok', message);
    console.log(message);
}

export function error(message: string) {
    logRaw('error', message);
    console.error(message);
}
export function debug(message: string) {
    logRaw('debug', message);
    console.log(message);
}

export function get() : ILogMessage[] {
    return logs;
}

export function enableLog() {
    logEnabled = true;
}

export function disableLog() {
    logEnabled = false;
}