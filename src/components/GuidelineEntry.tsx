import React from "react";
import {useRef} from "react";

export type GuidelineSpec = {
    xStep: number,
    yStep: number
}

export type GuidelineEntryProps = {
    callback: (spec: GuidelineSpec) => void
}

export default function GuidelineEntry(props: GuidelineEntryProps) {
    let xStepRef = useRef<HTMLInputElement>(null)
    let yStepRef = useRef<HTMLInputElement>(null)

    const onChange = () => props.callback({ xStep: xStepRef.current!.valueAsNumber, yStep: yStepRef.current!.valueAsNumber })

    return <div>
        Guidelines
        <div>
            <label>X Step:
                <input
                    ref={xStepRef}
                    onChange={onChange}
                    type="number"
                    defaultValue="10"
                />
            </label>
        </div>
        <div>
            <label>Y Step:
                <input
                    ref={yStepRef}
                    onChange={onChange}
                    type="number"
                    defaultValue="10"
                />
            </label>
        </div>
    </div>
}
