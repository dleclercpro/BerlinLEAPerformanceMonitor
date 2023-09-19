import { exec } from 'child_process';

abstract class Job {
    protected abstract name: string;

    public abstract execute(): Promise<void>;

    public getName() {
        return this.name;
    }

    protected async executeShellCommand(command: string) {
        return new Promise<void>((resolve, reject) => {
            exec(command, (err) => {
                if (err) reject(err);

                resolve();
            });
        });
    }
}

export default Job;