import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { writeFile } from './file';

export const createAndExportGraph = async (filepath: string, cfg: ChartConfiguration) => {
    const canvas = new ChartJSNodeCanvas({
        width: 1024,
        height: 728,
    });

    const imgBuffer = await canvas.renderToBuffer(cfg, 'image/png');
    const imgString = imgBuffer.toString();

    await writeFile(filepath, imgString);
}