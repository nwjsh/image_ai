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
  const [moderationLabels, setModerationLabels] = useState([])
  const [img, setImg] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedImage, setSelectedImage ] = useState('Beach.jpg');
  const { get, response , loading } = useFetch('https://sfbo2hwf68.execute-api.us-east-2.amazonaws.com')
  
  async function initializeLabels(imageName: string) {
    setIsLoading(true);
    const result = await get('/test/labels?imagename='+imageName)
    if (response.ok) 
    {
      setLabels(result['Labels'])
      setImg("data:image/jpg;base64, " + result.img)
      const moderationLabelResult = removeDuplicates(result.moderationLabels.map((item: any) => item.Name))
      setModerationLabels(moderationLabelResult)
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
        <option value="roulette.jfif">roulette</option>
      </select>
      <br/>
      {isLoading && 'Loading...'}
      {!isLoading && <img src={img} />}
      <br/>
      {!isLoading && 'AWS Rekognition finds these (labels) in the image:'}
      {!isLoading && labels.map((item: any) => (
        <div key={item.Name}>{item.Name}</div>
      ))}
      <>
      {moderationLabels.length !=0 && <p style={{color: "red"}}>Inappropriate image found! Inappropriate content:</p>}
      {moderationLabels.map((item: any) => (
        <div key={item} style={{color: "red"}}>{item}</div>
      ))}
    </>
    </>
  )
}

function removeDuplicates(arr: []) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}
export default App;
