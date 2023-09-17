import { ChartOptions, ChartType, Color, Tick } from 'chart.js';
import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas';
import { writeFile } from '../../utils/file';
import logger from '../../utils/logger';

// Do not remove: enables working with time scales
require('chartjs-adapter-moment');

interface GraphOptions {
    type: ChartType,
    title: string[],
    xMin?: number,
    xMax?: number,
    xAxisLabel: string,
    yAxisLabel: string,
    width?: number,
    height?: number,
    xTicksTransform?: (x: number, index: number, ticks: Tick[]) => string,
    yTicksTransform?: (y: number, index: number, ticks: Tick[]) => string,
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
            options: this.generateGraphOptions(opts),
            data: {
                datasets: datasets.map((dataset) => this.generateDatasetOptions(dataset)),
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

    protected generateDatasetOptions({ label, data, color }: Dataset) {
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

    protected generateGraphOptions(opts: GraphOptions): ChartOptions {
        const { title, xAxisLabel, yAxisLabel, xMin, xMax, xTicksTransform, yTicksTransform } = opts;
        
        return {
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
                    min: xMin,
                    max: xMax,
                    ...(xTicksTransform ? {
                        callback: xTicksTransform,
                    } : {}),
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
                    ...(yTicksTransform ? {
                        callback: yTicksTransform,
                    } : {}),
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