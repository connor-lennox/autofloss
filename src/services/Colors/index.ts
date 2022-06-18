export type Color = {
    red: number
    green: number
    blue: number
    alpha: number
}

export function colorSimilarity(c1: Color, c2: Color) {
    // Just RGB space difference. Eventually this should
    // probably be done by converting to LAB first.
    return 1 - (Math.sqrt((c1.red - c2.red)/ 255 + (c1.green - c2.green)/ 255 + (c1.blue - c2.blue)/ 255))
}
