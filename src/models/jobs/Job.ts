import { ExecOptions, exec } from 'child_process';

abstract class Job {
    protected name: string = this.constructor.name;

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

                // Return child process' command line output so it can be further
                // processed in the parent process
                resolve(stdout);
            });
        });
    }
}

export default Job;