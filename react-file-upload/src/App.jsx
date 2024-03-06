import { useState } from "react";
//Custom Hook
import { useObjectUrls } from "./customHooks/useObjectUrls";
import "./App.css";

function App() {
  //Will be an array filled with objects of type FileList
  const [fileData, setFileData] = useState([]);
  //This grabs that anonymous function from our custom hook
  const getObjectUrl = useObjectUrls();

  function handleFileUpload(e) {
    //Only update if the user has selected files, otherwise leave it.
    if (e.target.files?.length > 0) {
      //Store the data as an array of Files, instead of directly being a FileList object
      //The FileList object doesn't have nice Array convenience methods like .map()
      setFileData(Array.from(e.target.files));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (fileData?.length > 0) {
      const formData = new FormData();
      fileData.forEach(file => formData.append("photo", file));
      
      fetch(`http://localhost:5555/files/new/images`, {
        body: formData,
        method: "POST"
      })
      .then((res) => res.json())
      .then(data => console.log(data))
      .catch(console.error);
    }

  }

  //Derived State -- Efficiency could be improved with a memo, or more robust update that clears previous ObjectURLs
  /*
  let fileArr = [];
  if (fileData.length > 0) {
    for (let i = 0; i < fileData.length; i++) {
      //These URLs should be released after they are no longer being used
      fileArr.push(URL.createObjectURL(fileData[i]));
    }
  }
  */

  return (
    <>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="fileUpload"
          id="fileUpload"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          files={fileData}
        />
        <button type="submit">Submit Selected Files</button>
        <ul className="fileList">
          {fileData.map((file, index) => {
            return (
              <li key={index}>
                <img src={getObjectUrl(file)} alt={fileData[index].name} />
              </li>
            );
          })}
        </ul>
      </form>
    </>
  );
}

export default App;