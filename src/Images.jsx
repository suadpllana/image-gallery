import React, { useState, useRef } from "react";

const Images = () => {
  const inputRef = useRef(null);
  const [imagesData, setImagesData] = useState([]);
  const [page, setPage] = useState(1); 
  const accessKey = import.meta.env.VITE_API_KEY;

  async function images(newPage) {
    try{
        if(inputRef.current.value === ``){
            alert("Please fill the field")
            return
          }
          const url = `https://api.unsplash.com/search/photos?page=${newPage}&query=${inputRef.current.value}&client_id=${accessKey}`;
          const response = await fetch(url);
          const data = await response.json();
          if (!response.ok) {
           
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          if (newPage === 1) {
           
            setImagesData(data.results);
          } else {
            
            setImagesData((prevImages) => [...prevImages, ...data.results]);
          }
    }
   catch(error){
    alert("Something went wrong")
    return
   }
  }

  function showMore() {
    setPage(prev => prev + 1); 
    images(page);  
  }
  function enter(e){
    if(e.key === "Enter"){
        images(page)
    }
 
  }

  return (
    <div>
      <h1>Search for any images</h1>
      <input onKeyDown={(e) => enter(e)} ref={inputRef} type="text" />
      <button onClick={() => images(1)}>Search</button>
      {imagesData.length > 0 && (
        <>
          <div className="container">
            {imagesData.map((image, index) => (
              <img key={index} src={image.urls.small} alt="" />
            ))}
          </div>
        </>
      )}

      {imagesData.length >= 10 && (
        <button onClick={showMore} className="show-more">
          Show More
        </button>
      )}
    </div>
  );
};

export default Images;