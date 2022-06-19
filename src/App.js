import logo from './logo.svg';
import './App.css';
import {flossSpecs} from './services/Flosser/flossSpec.ts';
import {parseImage, pixelImageToImageData} from "./services/ImageParser";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useEffect, useRef, useState} from "react";

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    const ImageCanvas = props => {
        const canvasRef = useRef(null);

        useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if(selectedImage != null) {
                ctx.imageSmoothingEnabled = false;
                ctx.putImageData(pixelImageToImageData(selectedImage), 0, 0);
                ctx.drawImage(canvas, 0, 0, selectedImage.width, selectedImage.height, 0, 0, 800, 800);
            }
        })

        return <canvas ref={canvasRef} {...props}/>
    }

  return (
    <div className="App">
      <header className="App-header">
          <ImageCanvas width='800' height='800'/>
        <p>
          Loaded {flossSpecs.length} floss specifications.
          <br/>
          Example: {flossSpecs[10].name}
        </p>
        <input
          type="file"
          name="imageUpload"
          onChange={(event) => {
            parseImage(URL.createObjectURL(event.target.files[0])).then(d => {
                setSelectedImage(d);
                setImageData(d);
            })
          }}
        />
        <button
            onClick={() => setSelectedImage(solvePattern(imageData, 3))}
            disabled={imageData == null}
        >Solve</button>
      </header>
    </div>
  );
}

export default App;
