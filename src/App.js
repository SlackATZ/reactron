import logo from './logo.svg';
import './App.css';
import React, { useState, useRef } from 'react';

function App() {
  const filer = useRef(null)
  const dirr = useRef(null)
  const [files, setFiles] = useState([''])
  const [f, setF] = useState([''])
  const [binds, setBinds] = useState([])
  const dirChange = async (e) => {
    const file = await window.api.find(e.target.value);
    setFiles(file)
    setF([''])
  };
  const [reses, setReses] = useState([''])
  const readFile = async (index, file) => {
    const read = await window.api.read(file);
    setReses((pre) => {
      var dc = JSON.parse(JSON.stringify(pre))
      dc[index] = read
      return dc
    })
  }
  const blueFile = async (e) => {
    const index = e.target.id.replace('file','')
    //console.log(e.target.id.replace('file',''))
    if(files.includes(e.target.value)){
      if(index === 1 || binds.length >= index){
        readFile(index, dirr.current.value + '\\' + e.target.value);
      }
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input 
          id='filePath'
          ref={dirr}
          type="text"
          onChange={dirChange}
        />
        {files.length === 0 ? (<></>) : (<>
          {f.map((item, index) =>{return <>
            <input id={'file' + index}
                   className='file'
                   ref={filer}
                   list='files'
                   defaultValue={files[0]}
                   onBlur={blueFile}/>
            <datalist id='files'>{files.map((filename, index) => {
              return <option key={index} value={filename}></option>
            })}</datalist></>})}
        </>)}
        <div>{reses.map((res, index) => {
          return <label key={index}>{res}</label>
        })}</div>
      </header>
    </div>
  );
}

export default App;
