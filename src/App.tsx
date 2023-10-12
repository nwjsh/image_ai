import React, { useEffect, useState } from 'react';
import './App.css';
import useFetch from 'use-http';

function App() {
  return (
    <div className="App">
      
        <Todos/>
  
    </div>
  );
}
function Todos() {
  const options = {} // these options accept all native `fetch` options
  // the last argument below [] means it will fire onMount (GET by default)
  //const { loading, error, data = [] } = useFetch('https://sfbo2hwf68.execute-api.us-east-2.amazonaws.com/test/labels?imagename=Beach.jpg', options, [])
  const [labels, setLabels] = useState([])
  const [img, setImg] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedImage, setSelectedImage ] = useState('Beach.jpg');
  const { get, response , loading } = useFetch('https://sfbo2hwf68.execute-api.us-east-2.amazonaws.com')
  
  async function initializeLabels(imageName: string) {
    setIsLoading(true);
    const initialTodos = await get('/test/labels?imagename='+imageName)
    if (response.ok) 
    {
      setLabels(initialTodos['Labels'])
      setImg("data:image/jpg;base64, " + initialTodos.img)
    }
    setIsLoading(false);
  }
  useEffect(() => { initializeLabels(selectedImage) }, [selectedImage])
  return (
    <>
      <label>Choose an image:</label>
      <select  value={selectedImage} onChange={(e)=>{setSelectedImage(e.target.value)}}>
        <option value="Beach.jpg">Beach</option>
        <option value="Bird 1.jpg">Bird 1</option>
        <option value="Aspen Trees.jpg">Aspen Trees</option>
        <option value="Cat 2.jpg">Cat 2</option>
      </select>
      <br/>
      {isLoading && 'Loading...'}
      {!isLoading && <img src={img} />}
      <br/>
      {!isLoading && 'Labels of the image:'}
      {!isLoading && labels.map((todo: any) => (
        <div key={todo.Name}>{todo.Name}</div>
      ))}
      
    </>
  )
}

export default App;
