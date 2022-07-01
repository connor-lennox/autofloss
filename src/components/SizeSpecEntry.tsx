import React, {useRef} from "react";

const enum SelectionType {
    ABSOLUTE = "Absolute",
    FABRIC_SPEC = "Fabric Spec"
}

export type PixelDimension = {
    width: number,
    height: number,
    maintainAspectRatio: boolean
}

export type SizeSpecEntryProps = {
    callback: (spec: PixelDimension) => void
}

export default function SizeSpecEntry(props: SizeSpecEntryProps) {
    const [selectionType, setSelectionType] = React.useState(SelectionType.ABSOLUTE)

    let patternWidthRef = useRef<HTMLInputElement>(null)
    let patternHeightRef = useRef<HTMLInputElement>(null)

    let fabricCountRef = useRef<HTMLInputElement>(null)
    let fabricWidthRef = useRef<HTMLInputElement>(null)
    let fabricHeightRef = useRef<HTMLInputElement>(null)

    let maintainAspectRatioRef = useRef<HTMLInputElement>(null)

    // If our selection type is set to Absolute, then we just want to get the pixel width/height.
    // If we have a Fabric Spec, we need to calculate out the width/height instead.
    // Either way, we just dump our 6 variables into the passed down setter.

    const onChange = () => {
        if(selectionType === SelectionType.ABSOLUTE) {
            props.callback({
                width: Math.floor(patternWidthRef.current!.valueAsNumber),
                height: Math.floor(patternHeightRef.current!.valueAsNumber),
                maintainAspectRatio: maintainAspectRatioRef.current!.checked
            })
        } else {
            let fabricCount = fabricCountRef.current!.valueAsNumber;
            props.callback({
                width: Math.floor(fabricWidthRef.current!.valueAsNumber * fabricCount),
                height: Math.floor(fabricHeightRef.current!.valueAsNumber * fabricCount),
                maintainAspectRatio: maintainAspectRatioRef.current!.checked
            })
        }
    }

    return <div className="Specification-box">
        <u>Size Specification:</u>
        <div>
            <label>Dimension Method:
                <select value={selectionType} onChange={(event) => {
                    setSelectionType(event.target.value as SelectionType)
                    onChange()
                }}>
                    <option value={SelectionType.ABSOLUTE}>Absolute</option>
                    <option value={SelectionType.FABRIC_SPEC}>Fabric Spec</option>
                </select>
            </label>
        </div>

        {/* Absolute dimension method div */}
        <div style={{display: selectionType === SelectionType.ABSOLUTE ? 'contents' : 'none'}}>
            <div>
                <label>Pattern Width:
                    <input
                        ref={patternWidthRef}
                        onChange={onChange}
                        type="number"
                        defaultValue="50"
                    />
                </label>
            </div>
            <div>
                <label>Pattern Height:
                    <input
                        ref={patternHeightRef}
                        onChange={onChange}
                        type="number"
                        defaultValue="50"
                    />
                </label>
            </div>
        </div>

        {/* Fabric spec dimension method div */}
        <div style={{display: selectionType === SelectionType.FABRIC_SPEC ? 'block' : 'none'}}>
            <div>
                <label>Fabric Count:
                    <input
                        ref={fabricCountRef}
                        onChange={onChange}
                        type="number"
                        defaultValue="14"
                    />
                </label>
            </div>
            <div>
                <label>Fabric Height:
                    <input
                        ref={fabricHeightRef}
                        onChange={onChange}
                        type="number"
                        defaultValue="3"
                    />
                </label>
            </div>
            <div>
                <label>Fabric Width:
                    <input
                        ref={fabricWidthRef}
                        onChange={onChange}
                        type="number"
                        defaultValue="3"
                    />
                </label>
            </div>
        </div>

        <div>
            <label>Maintain Aspect Ratio:
                <input
                    ref={maintainAspectRatioRef}
                    onChange={onChange}
                    type="checkbox"
                    defaultChecked={true}/>
            </label>
        </div>
    </div>
}

