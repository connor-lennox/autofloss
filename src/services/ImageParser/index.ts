import {Color} from "../Colors";

export type PixelImage = {
    data: Array<Color>
    width: number
    height: number
}

export const getImagePixel = (image: PixelImage, x: number, y: number): Color => {
    return image.data[image.width * y + x]
}

export const pixelImageToImageData = (image: PixelImage): ImageData => {
    // Pack a PixelImage into a linearized array of rgba values
    let totalLength = image.data.length * 4;
    let res = new Uint8ClampedArray(totalLength);
    let pos = 0;
    for(let color of image.data) {
        res.set([color.red, color.green, color.blue, color.alpha], pos)
        pos += 4
    }
    return new ImageData(res, image.width, image.height);
}

const flatArrayToColors = (data: Uint8ClampedArray): Array<Color> => {
    return data.reduce((all: Array<number[]>, one: number, i: number) => {
        const ch = Math.floor(i / 4);
        all[ch] = ([] as number[]).concat((all[ch] || []), one);
        return all
    }, [] as number[][]).map(e => {
        return {
            red: e[0],
            green: e[1],
            blue: e[2],
            alpha: e[3]
        }
    });
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

        return {
            data: flatArrayToColors(ctx!.getImageData(
                0, 0, img.width, img.height
                ).data),
            width: img.width,
            height: img.height
        }
    })
}

export const downsampleImage = (image: PixelImage, newWidth: number, newHeight: number): PixelImage => {
    let wx = Math.floor(image.width / newWidth);
    let wy = Math.floor(image.height / newHeight);

    let newColors: Color[] = []

    for(let y = 0; y < newHeight; y++) {
        for(let x = 0; x < newWidth; x++) {
            newColors.push(getImagePixel(image, x * wx, y * wy));
        }
    }

    return {
        data: newColors,
        width: newWidth,
        height: newHeight
    }
}
