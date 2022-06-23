import React from "react";
import {FlossSpec} from "../services/Flosser/flossSpec";

export type FlossUsage = {
    spec: FlossSpec,
    stitches: number
}

export type FlossUsageTableProperties = {
    usages: Array<FlossUsage>
}

function FlossUsageTableEntry(props: FlossUsage) {
    return (
        <tr key={props.spec.id}>
            <td>{props.spec.name}</td>
            <td>{props.spec.id}</td>
            <td>{props.stitches}</td>
        </tr>
    )
}

export default function FlossUsageTable(props: FlossUsageTableProperties) {
    console.log(props)
    let rows = props.usages.map(usage => FlossUsageTableEntry(usage))

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Total Stitches</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}
