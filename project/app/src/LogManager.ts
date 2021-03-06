export interface ILogMessage {
  date: Date;
  level: 'debug' | 'ok' | 'error';
  message: string;
}

let logs: ILogMessage[] = [];
let logEnabled: boolean = true;

function logRaw(level: 'debug' | 'ok' | 'error', message: string) {
  if (!logEnabled) {
    return;
  }
  logs.push({
    date: new Date(),
    level,
    message,
  });
  if (logs.length > 500) {
    logs = logs.slice(logs.length - 500);
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

export function get(): ILogMessage[] {
  return logs;
}

export function enableLog() {
  logEnabled = true;
}

export function disableLog() {
  logEnabled = false;
}
