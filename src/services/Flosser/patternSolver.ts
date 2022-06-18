import {downsampleImage, PixelImage} from "../ImageParser";

export const solvePattern = (image: PixelImage, maxColors: number) => {
    console.log("Finding solution for image with " + image.height + " rows and " + image.width + " columns.")
    let downsampledImage = downsampleImage(image, 30, 30)
    console.log("Downsampled to 30x30:")
    console.log(downsampledImage)
}
