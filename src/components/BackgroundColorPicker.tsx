import {Color} from "../services/Colors";
import React, {useRef} from "react";

export type BackgroundColorPickerProps = {
    callback: (spec: Color) => void
}

export default function BackgroundColorPicker(props: BackgroundColorPickerProps) {
    let redRef = useRef<HTMLInputElement>(null)
    let greenRef = useRef<HTMLInputElement>(null)
    let blueRef = useRef<HTMLInputElement>(null)

    const onChange = () => {
        props.callback({red: redRef.current!.valueAsNumber, green: greenRef.current!.valueAsNumber, blue: blueRef.current!.valueAsNumber, alpha: 255})
    }

    return <div>
        Background Color
        <div>
            <label>Red:
                <input
                    ref={redRef}
                    onChange={onChange}
                    type="number"
                    defaultValue="255"
                />
            </label>
        </div>
        <div>
            <label>Green:
                <input
                    ref={greenRef}
                    onChange={onChange}
                    type="number"
                    defaultValue="255"
                />
            </label>
        </div>
        <div>
            <label>Blue:
                <input
                    ref={blueRef}
                    onChange={onChange}
                    type="number"
                    defaultValue="255"
                />
            </label>
        </div>
    </div>
}
