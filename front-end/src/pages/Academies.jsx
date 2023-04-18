import React, {useState, useEffect, useRef} from 'react'

function Academies() {
  
  const [academies, setAcademies] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const num_pages = useRef();
  const count = useRef();
  const academies_containter = useRef();

  function getPage(event) {
    getAcademies(event.target.id);
  }
  async function getAcademies(pageNum) {
    const response = await fetch(`http://127.0.0.1:8000/academies/?page_num=${pageNum}${
      (!isNaN(parseInt(count.current)) && count.current > 0)? `&count=${count.current}`: ''
    }`);
    const data = await response.json();
    console.log(data)
    let modifiedAcademies = { ...academies };
    modifiedAcademies[`${pageNum}`] = data.page_objects;
    setAcademies(modifiedAcademies);
    num_pages.current = data.num_pages;
    count.current = data.count

  }
  useEffect(() => {
    
    getAcademies(pageNum);
  }, [])
  console.log(academies)
  return (
    <>
      <ul ref={academies_containter}></ul>
      <div className="pages_nums d-flex gap-3">
        <button onClick={getPage} id="1">1</button>
        <button onClick={getPage} id="2">2</button>
        <button onClick={getPage} id="3">3</button>
        <button onClick={getPage} id="4">4</button>
      </div>
    </>
  )
}

export default Academies