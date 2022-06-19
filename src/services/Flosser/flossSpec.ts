import {Color} from "../Colors";

export type FlossSpec = {
    id: string
    name: string
    color: Color
}

type FlossJsonLine = {
    id: string
    name: string
    red: number
    green: number
    blue: number
    hex: string
}

export var flossSpecs: Array<FlossSpec> = (require('../../assets/floss_spec.json') as FlossJsonLine[]).map(
    f => {
        return {
            id: f.id,
            name: f.name,
            color: {
                red: f.red,
                green: f.green,
                blue: f.blue,
                alpha: 255
            }
        }
    }
)

export var whiteFlossSpec: FlossSpec = flossSpecs.find(fs => fs.id === 'White') || flossSpecs[0]
