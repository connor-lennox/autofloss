export type FlossSpec = {
    id: string
    name: string
    red: number
    green: number
    blue: number
    hex: string
}

export var specs: Array<FlossSpec> = require('../../assets/floss_spec.json')
