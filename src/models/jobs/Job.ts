import { exec } from 'child_process';

abstract class Job<Args = void> {
    protected abstract name: string;

    public abstract execute(args: Args): Promise<void>;

    public getName() {
        return this.name;
    }

    protected async executeShell(command: string) {
        return new Promise<string>((resolve, reject) => {
            exec(command, (err, stdout) => {
                if (err) {
                    reject(err);
                }

                resolve(stdout);
            });
        });
    }
}

export default Job;