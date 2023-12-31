import { ChartOptions, ChartType, Color as ChartColor, ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas';
import { writeFile } from '../../utils/file';
import logger from '../../logger';
import { GraphAxes, GraphAxis, Size } from '../../types';
import { DEFAULT_GRAPH_SIZE, DEVICE_PIXEL_RATIO } from '../../config/styles';
import { Color } from '../../constants/styles';
import { IMG_DIR } from '../../config/file';

// Do not remove: enables working with time scales
require('chartjs-adapter-moment');


export interface GraphData {
    getSize(): number;
}

export type GraphDataset = {
    label: string,
    color: ChartColor,
    data: { x: number, y: number }[],
};



abstract class Graph<Data extends GraphData> {
    protected abstract type: ChartType;
    protected abstract axes: GraphAxes;

    protected name: string = this.constructor.name;
    protected title?: string[];
    protected size: Size;
    protected img?: Buffer;
    protected mimeType: MimeType;
    protected storagePath?: string;

    protected abstract generateDatasets(data: Data): GraphDataset[];

    public constructor(size: Size = DEFAULT_GRAPH_SIZE, mimeType: MimeType = 'image/png') {
        this.size = size;
        this.mimeType = mimeType;
    }

    public async draw(data: Data) {
        if (data.getSize() < 2) throw new Error('Not enough data to plot graph.');

        const canvas = new ChartJSNodeCanvas({ ...this.size, backgroundColour: Color.White });
        const datasets = this.generateDatasets(data);
        const config = {
            type: this.type,
            options: this.generateOptions(),
            data: {
                datasets: datasets.map(({ data, label, color }: GraphDataset) => {
                    logger.trace(`Drawing ${data.length} datapoints of '${label}' dataset.`);
                    return {
                        ...this.generateDatasetOptions(label, color),
                        data,
                    };
                }),
            },
        } as ChartConfiguration;
    
        logger.debug(`Drawing '${this.name}' graph.`);

        this.img = await canvas.renderToBuffer(config, this.mimeType);    
    }

    public async store() {
        if (!this.img) {
            logger.warn(`There is no image to store!`);
            return;
        }

        // Use graph's name as filename
        this.storagePath = `${IMG_DIR}/${this.name}.png`;

        logger.trace(`Storing image to: ${this.storagePath}`);

        await writeFile(this.storagePath, this.img, true);
        
        logger.trace(`Image stored.`);
    }

    protected generateAxisLabel(axis: GraphAxis) {
        return axis.unit ? `${axis.label} (${axis.unit})` : axis.label;
    }

    protected generateOptions(): ChartOptions {
        return {
            devicePixelRatio: DEVICE_PIXEL_RATIO,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: this.generateAxisLabel(this.axes.x),
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
                        text: this.generateAxisLabel(this.axes.y),
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