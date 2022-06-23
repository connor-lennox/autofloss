import './App.css';
import {parseImage} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useRef, useState} from "react";
import FlossUsageTable from "./components/FlossUsageTable";
import PatternViewer from "./components/PatternViewer";

function App() {
    const [imageData, setImageData] = useState(null);

    const [patternResult, setPatternResult] = useState(null);

    const widthInputRef = useRef();
    const heightInputRef = useRef();
    const maxColorsInputRef = useRef();

  return (
    <div className="App">
      <header className="App-header">
          { patternResult != null ? <PatternViewer pattern={patternResult} targetWidth={600} targetHeight={600}/> : null }
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
