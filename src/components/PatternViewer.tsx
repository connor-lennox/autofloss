import React, {useEffect, useRef, useState} from 'react';
import {PatternResult} from "../services/Flosser/patternSolver";
import {pixelImageToImageData} from "../services/ImageProcessing";

export type PatterViewerProps = {
    pattern: PatternResult,
    targetWidth: number,
    targetHeight: number
}

export default function PatternViewer(props: PatterViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Match either the targetWidth or targetHeight, whichever leads to a smaller scale factor:
    let finishedImage = props.pattern.image;

    let widthScale = props.targetWidth / finishedImage.width;
    let heightScale = props.targetHeight / finishedImage.height;

    let canvasScale = Math.min(widthScale, heightScale)

    let canvasWidth = finishedImage.width * canvasScale, canvasHeight = finishedImage.height * canvasScale;

    const [hoveredFloss, setHoveredFloss] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx == null) throw new Error("failed to get canvas context");

            // On mouse move, update the display of the hovered color
            canvas.onmousemove = (ev: MouseEvent) => {
                let rect = canvas.getBoundingClientRect();
                let hoveredPixelX = Math.floor((ev.x - rect.x) / canvasScale), hoveredPixelY = Math.floor((ev.y - rect.y) / canvasScale);
                let hoveredFloss = props.pattern.flossSpecs[finishedImage.width * hoveredPixelY + hoveredPixelX];
                setHoveredFloss("(" + hoveredPixelX + ", " + hoveredPixelY + "): " + hoveredFloss.name + " : " + hoveredFloss.id);
            }

            // Clear anything that used to be on our canvas
            ctx.beginPath();
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)

            // Disable image smoothing: this is pixel art!
            ctx.imageSmoothingEnabled = false;

            // Draw the image to the canvas once, at its original scale
            ctx.putImageData(pixelImageToImageData(finishedImage), 0, 0);

            // Then overwrite the canvas with the same image, but expanded to fill the whole canvas
            ctx.drawImage(canvas, 0, 0, finishedImage.width, finishedImage.height, 0, 0, canvasWidth, canvasHeight);
            let xScale = canvasWidth / finishedImage.width;
            let yScale = canvasHeight / finishedImage.height;

            // Draw gridlines
            for (let x = 0; x < finishedImage.width + 1; x++) {
                ctx.moveTo(x * xScale, 0);
                ctx.lineTo(x * xScale, canvasHeight);
                ctx.stroke();
            }
            for (let y = 0; y < finishedImage.height + 1; y++) {
                ctx.moveTo(0, y * yScale);
                ctx.lineTo(canvasWidth, y * yScale);
                ctx.stroke();
            }
        }
    }, [canvasHeight, canvasRef, canvasScale, canvasWidth, finishedImage, props.pattern.flossSpecs])

    return <div>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
            <p>{hoveredFloss}</p>
        </div>
}
