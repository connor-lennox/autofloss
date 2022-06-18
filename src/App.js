import logo from './logo.svg';
import './App.css';
import {flossSpecs} from './services/Flosser/flossSpec.ts';
import {parseImage} from "./services/ImageParser";
import {solvePattern} from "./services/Flosser/patternSolver.ts";
import {useState} from "react";

function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageData, setImageData] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
          {selectedImage != null ? <img src={URL.createObjectURL(selectedImage)} alt="" /> : null }
        <p>
          Loaded {flossSpecs.length} floss specifications.
          <br/>
          Example: {flossSpecs[10].name}
        </p>
        <input
          type="file"
          name="imageUpload"
          onChange={(event) => {
            setSelectedImage(event.target.files[0]);
            parseImage(URL.createObjectURL(event.target.files[0])).then(d => setImageData(d))
          }}
        />
        <button
            onClick={() => solvePattern(imageData, 3)}
            disabled={imageData == null}
        >Solve</button>
      </header>
    </div>
  );
}

export default App;
