import React, { useState, useRef, useEffect } from "react";

const Images = () => {
  const inputRef = useRef(null);
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 
  const [bigImage, setBigImage] = useState();
  const accessKey = import.meta.env.VITE_API_KEY;

  
  useEffect(() => {
    if (imagesData.length > 0 && !bigImage) {
      setBigImage(imagesData[0].urls.small);
    }
  }, [imagesData, bigImage]);

  async function images(newPage) {
    if(inputRef.current.value === "") {
      alert("Please fill the field");
      setImagesData([])
      setBigImage(null)
      return;
  }
    setLoading(true);
    try {
       
        const url = `https://api.unsplash.com/search/photos?page=${newPage}&query=${inputRef.current.value}&client_id=${accessKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (newPage === 1) {
          
          setBigImage(undefined);
          setImagesData(data.results);
        } else {
          setImagesData((prevImages) => [...prevImages, ...data.results]);
        }
        setLoading(false);
    } catch (error) {
        alert("Something went wrong");
    }
  }

  function showMore() {
    setPage(prev => prev + 1); 
    images(page);  
  }

  function enter(e) {
    if(e.key === "Enter") {
        images(1); 
    }
  }

  return (
    <div>
      <h1>Search for any images</h1>
      <input placeholder="Enter the word you are searching images for" onKeyDown={(e) => enter(e)} ref={inputRef} type="text" />
      <button onClick={() => images(1)}>Search</button><br />
      {imagesData.length > 0 && (
        <img className="big-image" src={bigImage} alt="" />
      )}

      {imagesData.length > 0 && (
        <div className="container">
          {imagesData.map((image, index) => (
            <img
              style={{
                border: bigImage === image.urls.small ? '3px solid purple' : 'none'
              }}
              key={index}
              src={image.urls.small}
              onClick={() => setBigImage(image.urls.small)}
              alt=""
            />
          ))}
        </div>
      )}
      
      {loading && <p>Loading...</p>}

      {imagesData.length >= 10 && 
        <button onClick={showMore} className="show-more">
          Show More
        </button>
      }
    </div>
  );
}

export default Images;
