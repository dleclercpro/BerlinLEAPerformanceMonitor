import { ChartOptions, ChartType, Color as ChartColor, ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas';
import { touchFile, writeFile } from '../../utils/file';
import logger from '../../logger';
import { GraphAxes, Size } from '../../types';
import { DEFAULT_GRAPH_SIZE, DEVICE_PIXEL_RATIO } from '../../config/styles';
import { Color } from '../../constants/styles';

// Do not remove: enables working with time scales
require('chartjs-adapter-moment');



export type GraphDataset = {
    label: string,
    color: ChartColor,
    data: { x: number, y: number }[],
};



abstract class Graph<Data> {
    protected abstract name: string;
    protected abstract type: ChartType;
    protected abstract axes: GraphAxes;

    protected title?: string[];
    protected size: Size;
    protected filepath: string;
    protected img?: Buffer;
    protected mimeType: MimeType;

    protected abstract generateDatasets(data: Data): GraphDataset[];

    public constructor(filepath: string, size: Size = DEFAULT_GRAPH_SIZE, mimeType: MimeType = 'image/png') {
        this.size = size;
        this.filepath = filepath;
        this.mimeType = mimeType;
    }

    public async draw(data: Data) {
        logger.info(`Drawing '${this.name}' graph...`);

        const canvas = new ChartJSNodeCanvas({ ...this.size, backgroundColour: Color.White });
        const config: ChartConfiguration = {
            type: this.type,
            options: this.generateOptions(),
            data: {
                datasets: this.generateDatasets(data)
                    .map(({ data, label, color }: GraphDataset) => {
                        return {
                            ...this.generateDatasetOptions(label, color),
                            data,
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

    protected generateOptions(): ChartOptions {
        return {
            devicePixelRatio: DEVICE_PIXEL_RATIO,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: this.axes.x.label,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    min: this.axes.x.min,
                    max: this.axes.x.max,
                    ticks: {
                        stepSize: 1,
                        autoSkip: false,
                    },
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: this.axes.y.label,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                    min: this.axes.y.min,
                    max: this.axes.y.max,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: this.title,
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

    protected generateDatasetOptions(label: string, color: ChartColor) {
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