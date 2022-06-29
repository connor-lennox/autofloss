import './App.css';
import {parseImage} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useRef, useState} from "react";
import FlossUsageTable from "./components/FlossUsageTable";
import PatternViewer from "./components/PatternViewer";
import SizeSpecEntry from "./components/SizeSpecEntry";

function App() {
    const [imageData, setImageData] = useState(null);

    const [patternResult, setPatternResult] = useState(null);

    const [dimensions, setDimensions] = useState(null);

    const maxColorsInputRef = useRef();

    const solveImage = () => {
        setPatternResult(solvePattern(imageData, dimensions.width, dimensions.height, parseInt(maxColorsInputRef.current.value)))
    }

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
          <SizeSpecEntry callback={setDimensions}/>

          <label>Max Colors:
              <input
                  ref={maxColorsInputRef}
                  type="number"
                  defaultValue="5"
              />
          </label>
        <button
            onClick={solveImage}
            disabled={imageData == null}
        >Solve</button>

          {patternResult != null ?  <FlossUsageTable usages={patternResult.flossUsage}/> : null}

      </header>
    </div>
  );
}

export default App;
