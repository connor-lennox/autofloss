export type Color = {
    red: number
    green: number
    blue: number
    alpha: number
}

export function colorSimilarity(c1: Color, c2: Color) {
    // Just RGB space difference. Eventually this should
    // probably be done by converting to LAB first.
    return Math.sqrt((c1.red - c2.red) + (c1.green - c2.green) + (c1.blue - c2.blue))
}
