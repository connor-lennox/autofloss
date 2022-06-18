import {Color} from "../Colors";

export class PixelImage {
    public readonly data: Array<Color>;
    public readonly width: number;
    public readonly height: number;

    constructor(data: Uint8ClampedArray, width: number, height: number) {
        this.data = data.reduce((all: Array<number[]>, one: number, i: number) => {
            const ch = Math.floor(i / 4);
            all[ch] = ([] as number[]).concat((all[ch] || []), one);
            return all
        }, [] as number[][]).map(e => {
            return {
                red: e[0],
                blue: e[1],
                green: e[2],
                alpha: e[3]
            }
        });
        this.width = width;
        this.height = height;
    }

    public getPixel(x: number, y: number): Color {
        return this.data[this.width * y + x]
    }
}

export const parseImage = (imageURL: string) => {
    let img = new Image();
    img.src = imageURL;
    return img.decode().then(() => {
        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx!.drawImage(img, 0, 0);

        return new PixelImage(ctx!.getImageData(
            0, 0, img.width, img.height
        ).data, img.width, img.height);
    })
}
