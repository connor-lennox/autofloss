import {downsampleImage, PixelImage} from "../ImageParser";
import {Color, colorDistance} from "../Colors";
import {FlossSpec, flossSpecs} from "./flossSpec";

export const solvePattern = (image: PixelImage, maxColors: number) => {
    console.log("Finding solution for image with " + image.height + " rows and " + image.width + " columns.")
    let downsampledImage = downsampleImage(image, 50, 50)
    console.log("Downsampled to 30x30:")
    console.log(downsampledImage)

    let pixelFlossDistances: Array<Map<FlossSpec, number>> = downsampledImage.data.map(pixel => getColorFlossDistances(pixel));
    console.log(pixelFlossDistances)

    let bestPixelColors: Array<FlossSpec> = pixelFlossDistances.map(distances => {
        return [...distances.entries()].reduce((a, e) => e[1] < a[1] ? e : a)[0]
    })

    console.log(bestPixelColors)
}

const getColorFlossDistances = (color: Color): Map<FlossSpec, number> => {
    return new Map(
        flossSpecs.map(spec => {
            return [spec, colorDistance(color, spec.color)]
        }),
    );
}
