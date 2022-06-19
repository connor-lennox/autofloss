import {Color} from "../Colors";
import {getImagePixel, PixelImage} from "./index";

export const nearestNeighborDownsample = (image: PixelImage, newWidth: number, newHeight: number): PixelImage => {
    let wx = image.width / newWidth;
    let wy = image.height / newHeight;

    let newColors: Color[] = []

    for(let y = 0; y < newHeight; y++) {
        for(let x = 0; x < newWidth; x++) {
            let cx = Math.round(x * wx), cy = Math.round(y * wy);
            newColors.push(getImagePixel(image, cx, cy));
        }
    }

    return {
        data: newColors,
        width: newWidth,
        height: newHeight
    }
}


const gaussianOffsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const gaussianKernel = [1, 2, 1, 2, 4, 2, 1, 2, 1]

export const gaussianDownsample = (image: PixelImage, newWidth: number, newHeight: number): PixelImage => {
    let wx = image.width / (newWidth + 1);
    let wy = image.height / (newHeight + 1);

    // Half of wx and wy
    let hx = wx / 2, hy = wy / 2;

    let newColors: Color[] = []

    for(let y = 0; y < newHeight; y++) {
        for(let x = 0; x < newWidth; x++) {
            let cx = Math.round(wx * x + hx), cy = Math.round(wy * y + hy);
            let pixels = gaussianOffsets.map(o => getImagePixel(image, cx + o[0], cy + o[1]));
            let r = pixels.reduce((s, p, i) => s + p.red * gaussianKernel[i], 0) / 16;
            let g = pixels.reduce((s, p, i) => s + p.green * gaussianKernel[i], 0) / 16;
            let b = pixels.reduce((s, p, i) => s + p.blue * gaussianKernel[i], 0) / 16;
            newColors.push({red: r, green: g, blue: b, alpha: 255})
        }
    }

    return {
        data: newColors,
        width: newWidth,
        height: newHeight
    }
}
