import {gaussianDownsample, PixelImage} from "../ImageProcessing";
import {Color, colorDistance} from "../Colors";
import {FlossSpec, flossSpecs} from "./flossSpec";
import {FlossUsage} from "../../components/FlossUsageTable";

export type PatternResult = {
    image: PixelImage,
    flossSpecs: Array<FlossSpec>
    flossUsage: Array<FlossUsage>
}

export const solvePattern = (image: PixelImage, targetWidth: number, targetHeight: number, maxColors: number, backgroundColor: Color): PatternResult => {
    let downsampledImage = gaussianDownsample(image, targetWidth, targetHeight)

    let backgroundFloss = {
        id: 'background',
        name: 'background',
        color: backgroundColor
    };

    let pixelFlossDistances: Array<Map<FlossSpec, number>> = downsampledImage.data.map(pixel => getColorFlossDistances(pixel, backgroundFloss));

    let workingImage = new Array(pixelFlossDistances.length).fill(backgroundFloss);
    let selectedColors = new Set<FlossSpec>();
    selectedColors.add(backgroundFloss);

    for(let i = 0; i < maxColors; i++) {
        let bestSpec = findBestColorToAdd(workingImage, selectedColors, pixelFlossDistances);
        selectedColors.add(bestSpec);
        workingImage = applyColor(workingImage, pixelFlossDistances, bestSpec);
    }

    let stitchesPerFloss: Map<FlossSpec, number> = workingImage.reduce((counts, color) => {
        counts.set(color, (counts.get(color) + 1) || 0);
        return counts;
    }, new Map());

    let flossUsage: Array<FlossUsage> = [...stitchesPerFloss.keys()].filter(s => s.id !== 'background').map(k => ({
        spec: k,
        stitches: stitchesPerFloss.get(k) || 0
    }));

    let foundColorMapping: Color[] = workingImage.map(f => f.color);

    let finishedImage = {
        data: foundColorMapping,
        width: downsampledImage.width,
        height: downsampledImage.height
    }

    return {
        image: finishedImage,
        flossSpecs: workingImage,
        flossUsage: flossUsage
    }
}

const getColorFlossDistances = (color: Color, background: FlossSpec): Map<FlossSpec, number> => {
    // Calculate for available floss specs
    let distanceMap = new Map(
        flossSpecs.map(spec => {
            return [spec, colorDistance(color, spec.color)]
        }),
    );

    // Calculate distance for background color
    distanceMap.set(background, colorDistance(color, background.color));

    return distanceMap;
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
        distances[i].get(specToApply)! < distances[i].get(curSpec)! ? specToApply : curSpec
    )
}
