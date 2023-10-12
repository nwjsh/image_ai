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
  const [imageNames, setImageNames] = useState([])
  const [selectedImage, setSelectedImage ] = useState('Beach.jpg');
  const { get, response , loading } = useFetch('https://sfbo2hwf68.execute-api.us-east-2.amazonaws.com')
  
  async function initializeLabels(imageName: string) {
    setIsLoading(true);
    const result = await get('/test/labels?imagename='+imageName)
    const imageNameResult = await get('/test/imagenames')
    if (response.ok && result && imageNameResult) 
    {
      setLabels(result['Labels'])
      setImg("data:image/jpg;base64, " + result.img)
      const moderationLabelResult = removeDuplicates(result.moderationLabels.map((item: any) => item.Name))
      setModerationLabels(moderationLabelResult)
      setImageNames(imageNameResult)
    }
    setIsLoading(false);
  }
  useEffect(() => { initializeLabels(selectedImage) }, [selectedImage])
  return (
    <>
      <label>Choose an image:</label>
      <select  value={selectedImage} onChange={(e)=>{setSelectedImage(e.target.value)}}>
        {imageNames.map((imageName: any) => (
           <option key={imageName.file_name} value={imageName.full_name}>{imageName.file_name}</option>
        ))}
      </select>
      <br/>
      {isLoading && 'Loading...'}
      {!isLoading && 
        <>
          <img src={img} width={500} height={350}/>
          <br/>
          {'AWS Rekognition finds these (labels) in the image:'}
          {labels.map((item: any) => (
            <div key={item.Name}>{item.Name}</div>
          ))}
          {moderationLabels.length !=0 && <p style={{color: "red"}}>Inappropriate image found! Inappropriate content:</p>}
          {moderationLabels.map((item: any) => (
            <div key={item} style={{color: "red"}}>{item}</div>
          ))}
        </>
      }
    </>
  )
}

function removeDuplicates(arr: []) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}
export default App;
