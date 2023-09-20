import { ExecOptions, exec } from 'child_process';

abstract class Job {
    protected abstract name: string;

    public abstract execute(): Promise<void>;

    public getName() {
        return this.name;
    }

    protected async executeShell(command: string, options?: ExecOptions) {
        return new Promise<string | Buffer>((resolve, reject) => {
            exec(command, options, (err, stdout) => {
                if (err) {
                    reject(err);
                }

                resolve(stdout);
            });
        });
    }
}

export default Job;