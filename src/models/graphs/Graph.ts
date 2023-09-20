import { ChartOptions, ChartType, Color, ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas';
import { touchFile, writeFile } from '../../utils/file';
import logger from '../../logger';

// Do not remove: enables working with time scales
require('chartjs-adapter-moment');

export interface GraphBaseOptions {
    type: ChartType,
    title: string[],
    size?: {
        width?: number,
        height?: number,
    },
    axes: {
        x: {
            label: string,
            min?: number,
            max?: number,
        },
        y: {
            label: string,
            min?: number,
            max?: number,
        },
    },
}

export interface GraphDatasetOptions {
    label: string,
    color: Color,
}

export type GraphDataset = { x: number, y: number }[];



abstract class Graph<Data> {
    protected abstract name: string;

    protected filepath: string;
    protected img?: Buffer;
    protected mimeType: MimeType;

    protected abstract generateBaseOptions(title: string[]): GraphBaseOptions;
    protected abstract generateDatasetOptions(args: any): GraphDatasetOptions[];
    protected abstract generateDatasets(data: Data): GraphDataset[];

    public constructor(filepath: string, mimeType: MimeType = 'image/png') {
        this.filepath = filepath;
        this.mimeType = mimeType;
    }

    public async draw(title: string[], data: Data) {
        logger.info(`Drawing '${this.name}' graph...`);

        const baseOptions = this.generateBaseOptions(title);
        const datasetOptions = this.generateDatasetOptions(data);
        const datasets = this.generateDatasets(data);

        const canvas = new ChartJSNodeCanvas({
            width: baseOptions.size?.width ?? 1024,
            height: baseOptions.size?.height ?? 728,
            backgroundColour: 'white',
        });

        const config: ChartConfiguration = {
            type: baseOptions.type,
            options: this.fillBaseOptions(baseOptions),
            data: {
                datasets: datasets.map((dataset: GraphDataset, i) => {
                    return {
                        ...this.fillDatasetOptions(datasetOptions[i]),
                        data: dataset,
                    };
                }),
            },
        };
    
        this.img = await canvas.renderToBuffer(config, this.mimeType);    
    }

    public async store() {
        if (!this.img) {
            logger.warn(`There is no image to store!`);
            return;
        }

        logger.trace(`Storing image to: ${this.filepath}`);
        await touchFile(this.filepath);
        await writeFile(this.filepath, this.img);
        logger.trace(`Image stored.`);
    }

    protected fillBaseOptions(opts: GraphBaseOptions): ChartOptions {
        const { title, axes } = opts;
        
        return {
            devicePixelRatio: 4,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: axes.x.label,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    min: axes.x.min,
                    max: axes.x.max,
                    ticks: {
                        stepSize: 1,
                        autoSkip: false,
                    },
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: axes.y.label,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    min: axes.y.min,
                    max: axes.y.max,
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
                legend: {
                    position: 'right',
                },
            },
        };
    }

    protected fillDatasetOptions({ label, color }: GraphDatasetOptions) {
        return {
            label,
            xAxisID: 'x',
            yAxisID: 'y',
            borderColor: color,
            backgroundColor: color,
            pointRadius: 1,
            borderWidth: 1,
            tension: 0.5,
        };
    }
}

export default Graph;