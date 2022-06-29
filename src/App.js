import './App.css';
import {parseImage} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {exportPatternPdf} from "./services/PatternExport";
import {useRef, useState} from "react";
import FlossUsageTable from "./components/FlossUsageTable";
import PatternViewer from "./components/PatternViewer";
import SizeSpecEntry from "./components/SizeSpecEntry";

function App() {
    const [imageData, setImageData] = useState(null);

    const [patternResult, setPatternResult] = useState(null);

    const [dimensions, setDimensions] = useState({width: 50, height: 50});

    const maxColorsInputRef = useRef();

    const solveImage = () => {
        setPatternResult(solvePattern(imageData, dimensions.width, dimensions.height, parseInt(maxColorsInputRef.current.value)))
    }

    const exportPattern = async () => {
        let pdfBytes = await exportPatternPdf(patternResult)
        let blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const a = document.createElement('a');
        a.download = 'my-file.txt';
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    }

    return (
        <div className="App">
            <body className="App-header">
                { patternResult != null ? <PatternViewer pattern={patternResult} targetWidth={600} targetHeight={600}/> : null }
                <input
                    type="file"
                    name="imageUpload"
                    onChange={(event) => {
                        parseImage(URL.createObjectURL(event.target.files[0])).then(d => {
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

                <button
                    onClick={exportPattern}
                    disabled={patternResult == null}
                >Export</button>

              {patternResult != null ?  <FlossUsageTable usages={patternResult.flossUsage}/> : null}

            </body>
        </div>
    );
}

export default App;
