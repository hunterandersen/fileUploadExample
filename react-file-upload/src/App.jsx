import { useState } from "react";
import "./App.css";

function App() {
  //Will be of type FileList
  const [fileData, setFileData] = useState([]);

  function handleFileUpload(e) {
    //Preserve the previous file selection if there was one
    if (e.target.files?.length > 0) {
      setFileData(e.target.files);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (fileData?.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < fileData.length; i++) {
        formData.append("photo", fileData[i]);
      }
      
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
  let fileArr = [];
  if (fileData.length > 0) {
    for (let i = 0; i < fileData.length; i++) {
      //These URLs should be released after they are no longer being used
      fileArr.push(URL.createObjectURL(fileData[i]));
    }
  }

  return (
    <>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="fileUpload"
          id="fileUpload"
          multiple
          onChange={handleFileUpload}
          files={fileData}
        />
        <button type="submit">Submit Selected Files</button>
        <ul className="fileList">
          {fileArr.map((file, index) => {
            return (
              <li key={index}>
                <img src={file} alt={fileData[index].name} />
              </li>
            );
          })}
        </ul>
      </form>
    </>
  );
}

export default App;
