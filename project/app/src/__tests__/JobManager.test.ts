//jest.mock('homey');
import { ManagerCron } from 'homey';
import { IJobManagerListener, JobManager } from '../JobManager'

jest.mock('homey');

const dummy: IJobManagerListener = {
    onResetMaxMin() { },

}
describe('JobManager should work', () => {
    let jm;
    test('can be created', () => {
        jm = new JobManager(dummy);
        expect((jm as any).dailyReset).toEqual('never');
        expect((jm as any).task).toBeUndefined();
    })
    describe('start should work', () => {

        test('should delete old tasks', async () => {
            ManagerCron.getTasks = jest.fn().mockReturnValue([{ id: 'test' }]);

            await jm.start();
            expect((jm as any).dailyReset).toEqual('never');
            expect((jm as any).task).toBeUndefined();
        })
    })

})