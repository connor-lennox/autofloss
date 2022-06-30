import './App.css';
import {parseImage} from "./services/ImageProcessing";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {exportPatternPdf} from "./services/PatternExport";
import {useRef, useState} from "react";
import FlossUsageTable from "./components/FlossUsageTable";
import PatternViewer from "./components/PatternViewer";
import SizeSpecEntry from "./components/SizeSpecEntry";
import BackgroundColorPicker from "./components/BackgroundColorPicker";
import GuidelineEntry from "./components/GuidelineEntry";

function App() {
    const [imageData, setImageData] = useState(null);

    const [patternResult, setPatternResult] = useState(null);

    const [dimensions, setDimensions] = useState({width: 50, height: 50});
    const [backgroundColor, setBackgroundColor] = useState({red: 255, green: 255, blue: 255, alpha: 255})
    const [guidelineSpec, setGuidelineSpec] = useState({xStep: 10, yStep: 10})

    const maintainAspectRatioRef = useRef();
    const maxColorsInputRef = useRef();

    const solveImage = () => {
        let maintainRatio = maintainAspectRatioRef.current.checked

        let passedDimensions = dimensions;
        if(maintainRatio) {
            let xScale = dimensions.width / imageData.width;
            let yScale = dimensions.height / imageData.height;
            let imageScale = Math.min(xScale, yScale);
            passedDimensions = {width: Math.floor(imageData.width * imageScale), height: Math.floor(imageData.height * imageScale)}
        }
        setPatternResult(solvePattern(imageData, passedDimensions.width, passedDimensions.height, parseInt(maxColorsInputRef.current.value), backgroundColor))
    }

    const exportPattern = async () => {
        let pdfBytes = await exportPatternPdf(patternResult, guidelineSpec)
        let blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const a = document.createElement('a');
        a.download = 'stitch-spec.pdf';
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
                    accept="image/*"
                    onChange={(event) => {
                        parseImage(URL.createObjectURL(event.target.files[0])).then(d => {
                            setImageData(d);
                        })
                    }}
                />
                <div className="Horizontal-flex">
                    <SizeSpecEntry callback={setDimensions}/>
                    <BackgroundColorPicker callback={setBackgroundColor}/>
                    <GuidelineEntry callback={setGuidelineSpec}/>
                </div>

                <div className="Horizontal-flex">
                    <label>Max Colors:
                      <input
                          ref={maxColorsInputRef}
                          type="number"
                          defaultValue="5"
                      />
                    </label>
                    <label>Maintain Aspect Ratio:
                        <input
                            ref={maintainAspectRatioRef}
                            type="checkbox"
                            defaultChecked={true}
                        />
                    </label>
                </div>
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
