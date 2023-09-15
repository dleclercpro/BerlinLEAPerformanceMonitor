import { ChartOptions, ChartType, Color } from 'chart.js';
import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas';
import { writeFile } from '../../utils/file';
import logger from '../../logger';

// Do not remove: enables working with time scales
require('chartjs-adapter-moment');

interface GraphOptions {
    type: ChartType,
    title: string[],
    xAxisLabel: string,
    yAxisLabel: string,
    width?: number,
    height?: number,
}

interface Dataset {
    label: string,
    data: { x: number, y: number }[],
    color: Color,
}

abstract class Graph<Data> {
    protected filepath: string;
    protected img?: Buffer;
    protected mimeType: MimeType;

    public abstract draw(data: Data): Promise<void>;

    public constructor(filepath: string, mimeType: MimeType = 'image/png') {
        this.filepath = filepath;
        this.mimeType = mimeType;
    }

    public async generate(datasets: Dataset[], opts: GraphOptions) {
        const { type } = opts;

        const canvas = new ChartJSNodeCanvas({
            width: opts.width ?? 1024,
            height: opts.height ?? 728,
            backgroundColour: 'white',
        });

        const cfg = {
            type,
            options: this.getGraphOptions(opts),
            data: {
                datasets: datasets.map((dataset) => this.getDatasetOptions(dataset)),
            },
        };
    
        this.img = await canvas.renderToBuffer(cfg, this.mimeType);    
    }

    public async store() {
        if (!this.img) {
            logger.warn(`There is no image to store!`);
            return;
        }

        logger.trace(`Storing image to: ${this.filepath}`);
        await writeFile(this.filepath, this.img);
        logger.trace(`Image stored.`);
    }

    protected getDatasetOptions({ label, data, color }: Dataset) {
        return {
            label,
            data,
            xAxisID: 'x',
            yAxisID: 'y',
            borderColor: color,
            backgroundColor: color,
            pointRadius: 2,
            tension: 0.25,
        };
    }

    protected getGraphOptions({ title, xAxisLabel, yAxisLabel }: GraphOptions): ChartOptions {
        return {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            xAxisLabel: 'YYYY.MM.dd - HH:mm',
                        },
                    },
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
        };
    }
}

export default Graph;