import { ChartOptions, Color } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { writeFile } from '../../utils/file';

interface Options {
    title: string,
    xAxisLabel: string,
    yAxisLabel: string,
    width?: number,
    height?: number,
}

interface LineOptions {
    label: string,
    data: { x: number, y: number }[],
    color: Color,
}

abstract class Graph<Data> {
    protected filepath: string;

    public abstract draw(data: Data[]): Promise<void>;

    public constructor(filepath: string) {
        this.filepath = filepath;
    }

    public async generate(lines: LineOptions[], opts: Options) {
        const canvas = new ChartJSNodeCanvas({
            width: opts.width ?? 1024,
            height: opts.height ?? 728,
            backgroundColour: 'white',
        });
    
        const img = await canvas.renderToBuffer({
            type: 'line',
            options: this.getOptions(opts),
            data: {
                datasets: lines.map((line) => this.getLineOptions(line)),
            },
        }, 'image/png');
    
        await writeFile(this.filepath, img);
    }

    protected getLineOptions({ label, data, color }: LineOptions) {
        return {
            label,
            data,
            xAxisID: 'x',
            yAxisID: 'y',
            borderColor: color,
            backgroundColor: color,
            pointRadius: 1,
            tension: 0.25,
        };
    }

    protected getOptions({ title, xAxisLabel, yAxisLabel }: Options): ChartOptions {
        return {
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: xAxisLabel,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: yAxisLabel,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                },
            },
        };
    }
}

export default Graph;