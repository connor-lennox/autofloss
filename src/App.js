import './App.css';
import {parseImage, pixelImageToImageData} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useEffect, useRef, useState} from "react";
import FlossUsageTable from "./components/FlossUsageTable";

function App() {
    const [imageData, setImageData] = useState(null);

    const [patternResult, setPatternResult] = useState(null);

    const widthInputRef = useRef();
    const heightInputRef = useRef();
    const maxColorsInputRef = useRef();

    const ImageCanvas = props => {
        const canvasRef = useRef(null);

        useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if(patternResult != null) {
                let finishedImage = patternResult.image;
                ctx.imageSmoothingEnabled = false;
                ctx.putImageData(pixelImageToImageData(finishedImage), 0, 0);
                ctx.drawImage(canvas, 0, 0, finishedImage.width, finishedImage.height, 0, 0, 800, 800);
                let xScale = 800 / finishedImage.width;
                let yScale = 800 / finishedImage.height;

                for(let x = 0; x < finishedImage.width; x++) {
                    ctx.moveTo(x * xScale, 0);
                    ctx.lineTo(x * xScale, 800);
                    ctx.stroke();
                }
                for(let y = 0; y < finishedImage.height; y++) {
                    ctx.moveTo(0, y * yScale);
                    ctx.lineTo(800, y * yScale);
                    ctx.stroke();
                }
            }
        })

        return <canvas ref={canvasRef} {...props}/>
    }

  return (
    <div className="App">
      <header className="App-header">
          <ImageCanvas width='800' height='800'/>
        <input
          type="file"
          name="imageUpload"
          onChange={(event) => {
            parseImage(URL.createObjectURL(event.target.files[0])).then(d => {
                // setSelectedImage(d);
                setImageData(d);
            })
          }}
        />

          <label>Pattern Width:
              <input
                  ref={widthInputRef}
                  type="number"
                  defaultValue="50"
              />
          </label>
          <label>Pattern Height:
              <input
                  ref={heightInputRef}
                  type="number"
                  defaultValue="50"
              />
          </label>
          <label>Max Colors:
              <input
                  ref={maxColorsInputRef}
                  type="number"
                  defaultValue="5"
              />
          </label>
        <button
            onClick={() => setPatternResult(solvePattern(imageData, parseInt(widthInputRef.current.value), parseInt(heightInputRef.current.value), parseInt(maxColorsInputRef.current.value)))}
            disabled={imageData == null}
        >Solve</button>

          {patternResult != null ?  <FlossUsageTable usages={patternResult.flossUsage}/> : null}
      </header>
    </div>
  );
}

export default App;
