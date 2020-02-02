import { ManagerCron } from 'homey';
import { debug, error, log } from './LogManager';

const taskname = 'dailyreset';

export interface IJobManagerListener {
  onResetMaxMin();
}
export class JobManager {
  private dailyReset: string;
  private task: any;
  private listener: IJobManagerListener;

  constructor(listener: IJobManagerListener) {
    this.dailyReset = 'never';
    this.task = undefined;
    this.listener = listener;
  }

  public async onSettinsUpdated(dailyReset: string) {
    if (this.dailyReset !== dailyReset) {
      this.dailyReset = dailyReset;
      await this.start();
    }
  }
  public async start() {
    try {
      log('installing scheduled tasks');
      try {
        const tasks = await ManagerCron.getTasks(taskname);
        for (const task of tasks) {
          debug(`Uninstalling task: ${task.id}`);
          await ManagerCron.unregisterTask(task.id);
        }
      } catch (err) {
        error(`Failed to remove existing job: ${err}`);
      }
      if (this.dailyReset !== 'never') {
        const cron = this.getDailyRestCron();
        debug(`Updated time to: ${cron}`);
        this.task = await ManagerCron.registerTask(taskname, cron);
        this.task.on('run', () => this.listener.onResetMaxMin());
      } else {
        log('Reseting of max/min temperatures is disabled');
      }
    } catch (err) {
      error(`Failed to reset task: ${err}`);
    }
  }
  private getDailyRestCron() {
    const parts = this.dailyReset.split(':');
    const hour = parts.length > 0 ? parts[0] : '2';
    const minute = parts.length > 1 ? parts[1] : '00';
    return `0 ${minute} ${hour} * * *`;
  }
}
