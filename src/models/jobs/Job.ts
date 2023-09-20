import { exec } from 'child_process';

abstract class Job<Args = void> {
    protected abstract name: string;

    public abstract execute(args: Args): Promise<void>;

    public getName() {
        return this.name;
    }

    protected async executeShell(command: string) {
        return new Promise<void>((resolve, reject) => {
            exec(command, (err) => {
                if (err) reject(err);

                resolve();
            });
        });
    }
}

export default Job;