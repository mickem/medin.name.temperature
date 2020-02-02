//jest.mock('homey');
import { ManagerCron } from 'homey';
import { IJobManagerListener, JobManager } from '../JobManager';

jest.mock('homey');

const dummy: IJobManagerListener = {
  onResetMaxMin: jest.fn(),
};
describe('JobManager should work', () => {
  let jm;
  test('can be created', () => {
    jm = new JobManager(dummy);
    expect((jm as any).dailyReset).toEqual('never');
    expect((jm as any).task).toBeUndefined();
  });
  describe('start should work', () => {
    test('should delete old tasks', async () => {
      ManagerCron.getTasks = jest.fn().mockReturnValue([{ id: 'test' }]);
      ManagerCron.unregisterTask = jest.fn();
      ManagerCron.registerTask = jest.fn();

      await jm.start();
      expect((jm as any).dailyReset).toEqual('never');
      expect((jm as any).task).toBeUndefined();
      expect(ManagerCron.unregisterTask).toBeCalledWith('test');
      expect(ManagerCron.registerTask).not.toBeCalled();
    });
  });
  describe('Triggering task should work', () => {
    const task = {
      fun: undefined,
      on(event, fun) {
        this.fun = fun;
      },
    };
    test('onSettinsUpdated should register task', async () => {
      ManagerCron.unregisterTask = jest.fn();
      ManagerCron.registerTask = jest.fn().mockReturnValue(task);
      await jm.onSettinsUpdated('7:22');
      expect((jm as any).dailyReset).toEqual('7:22');
      expect((jm as any).task).toBeDefined();
      expect(ManagerCron.unregisterTask).toBeCalledWith('test');
      expect(ManagerCron.registerTask).toBeCalledWith('dailyreset', '0 22 7 * * *');
    });
    test('triggering task', async () => {
      expect(dummy.onResetMaxMin).not.toBeCalled();
      task.fun();
      expect(dummy.onResetMaxMin).toBeCalled();
    });
  });
});
