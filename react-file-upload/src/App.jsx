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
      setFiles(e.target.files);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (files?.length > 0) {
      const postHeaders = new Headers();
      postHeaders.append("Content-Type", "image/jpeg");
      
      fetch(`http://localhost:5555/files/new/${files[0].name}`, {
        body: files[0],
        method: "POST",
        headers: postHeaders
      })
      .then((res) => console.log(res))
    }

  }

  //Derived State -- Efficiency could be improved with a memo, or more robust update that clears previous ObjectURLs
  let fileArr = [];
  if (files.length > 0) {
    let i = 0;
    let tempFile;
    while ((tempFile = files.item(i++))) {
      fileArr.push(URL.createObjectURL(tempFile));
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
