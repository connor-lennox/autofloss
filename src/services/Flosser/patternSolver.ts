import {nearestNeighborDownsample, gaussianDownsample, PixelImage} from "../ImageProcessing";
import {Color, colorDistance} from "../Colors";
import {FlossSpec, flossSpecs} from "./flossSpec";

export const solvePattern = (image: PixelImage, maxColors: number) => {
    console.log("Finding solution for image with " + image.height + " rows and " + image.width + " columns.")
    let downsampledImage = gaussianDownsample(image, 50, 50)
    console.log("Downsampled to 30x30:")
    console.log(downsampledImage)

    let pixelFlossDistances: Array<Map<FlossSpec, number>> = downsampledImage.data.map(pixel => getColorFlossDistances(pixel));
    console.log(pixelFlossDistances)

    // TODO: Fill this with whatever spec is 'White' instead, to represent the background
    //       or do we provide a separate background color field?
    let workingImage = new Array(pixelFlossDistances.length).fill(flossSpecs[0])
    let selectedColors = new Set<FlossSpec>();

    for(let i = 0; i < maxColors; i++) {
        console.log(workingImage)
        let bestSpec = findBestColorToAdd(workingImage, selectedColors, pixelFlossDistances);
        selectedColors.add(bestSpec);
        console.log(bestSpec)
        workingImage = applyColor(workingImage, pixelFlossDistances, bestSpec);
    }

    let foundColorMapping: Color[] = workingImage.map(f => f.color);

    let finishedImage = {
        data: foundColorMapping,
        width: downsampledImage.width,
        height: downsampledImage.height
    }

    return finishedImage
}

const getColorFlossDistances = (color: Color): Map<FlossSpec, number> => {
    return new Map(
        flossSpecs.map(spec => {
            return [spec, colorDistance(color, spec.color)]
        }),
    );
}

const findBestColorToAdd = (working: Array<FlossSpec>, selected: Set<FlossSpec>, distances: Array<Map<FlossSpec, number>>): FlossSpec => {
    // Finds the best color to add given a current working image and the floss-pixel distance for each pair.

    // Basic concept:
    // We can find the "entropy reduction" over the entire image for a given color. We want to pick the color
    // that has the highest reduction in entropy.
    // The sum of the negative differences in distance by applying this color over all pixels is the amount
    // by which entropy will change. Positive differences are ignored, because the color wouldn't be
    // used in those positions (old color remains).
    let entropyReductions: Map<FlossSpec, number> = distances.reduce((totals, cur, i) => {
        for(let entry of cur.entries()) {
            totals.set(entry[0], (totals.get(entry[0]) || 0) + (Math.min(0, entry[1] - (cur.get(working[i]) || 0))));
        }
        return totals
    }, new Map());

    return [...entropyReductions.entries()].reduce((best, cur) => {
        return (!selected.has(cur[0])) ? (cur[1] < best[1] ? cur : best) : best
    })[0]
}

const applyColor = (working: Array<FlossSpec>, distances: Array<Map<FlossSpec, number>>, specToApply: FlossSpec): Array<FlossSpec> => {
    return working.map((curSpec, i) =>
        (distances[i].get(specToApply) || Number.MAX_VALUE) < (distances[i].get(curSpec) || Number.MAX_VALUE) ? specToApply : curSpec
    )
}
