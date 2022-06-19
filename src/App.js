import logo from './logo.svg';
import './App.css';
import {flossSpecs} from './services/Flosser/flossSpec.ts';
import {parseImage, pixelImageToImageData} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useEffect, useRef, useState} from "react";

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    const widthInputRef = useRef();
    const heightInputRef = useRef();
    const maxColorsInputRef = useRef();

    const ImageCanvas = props => {
        const canvasRef = useRef(null);

        useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if(selectedImage != null) {
                ctx.imageSmoothingEnabled = false;
                ctx.putImageData(pixelImageToImageData(selectedImage), 0, 0);
                ctx.drawImage(canvas, 0, 0, selectedImage.width, selectedImage.height, 0, 0, 800, 800);
                let xScale = 800 / selectedImage.width;
                let yScale = 800 / selectedImage.height;

                for(let x = 0; x < selectedImage.width; x++) {
                    ctx.moveTo(x * xScale, 0);
                    ctx.lineTo(x * xScale, 800);
                    ctx.stroke();
                }
                for(let y = 0; y < selectedImage.height; y++) {
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
            onClick={() => setSelectedImage(solvePattern(imageData, parseInt(widthInputRef.current.value), parseInt(heightInputRef.current.value), parseInt(maxColorsInputRef.current.value)))}
            disabled={imageData == null}
        >Solve</button>
      </header>
    </div>
  );
}

export default App;
