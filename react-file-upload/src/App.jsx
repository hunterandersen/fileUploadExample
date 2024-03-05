import { useState } from "react";
import "./App.css";

function App() {
  //Will be of type FileList
  const [files, setFiles] = useState([]);

  function handleFileUpload(e) {
    //Preserve the previous file selection if there was one
    if (e.target.files.length == 0 && files?.length > 0) {
      e.target.files = files;
    } else {
      //The File Interface on MDN
      setFiles(e.target.files);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (files?.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("photo", files[i]);
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
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      //These URLs should be released after they are no longer being used
      fileArr.push(URL.createObjectURL(files[i]));
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
        />
        <button type="submit">Submit Selected Files</button>
        <ul className="fileList">
          {fileArr.map((file, index) => {
            return (
              <li key={index}>
                <img src={file} alt={files[index].name} />
              </li>
            );
          })}
        </ul>
      </form>
    </>
  );
}

export default App;
