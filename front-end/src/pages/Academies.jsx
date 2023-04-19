import React, {useState, useEffect, useRef} from 'react'

function Academies() {
  const [academies, setAcademies] = useState({data: []});
  const [pageNum, setPageNum] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const num_pages = useRef();
  const count = useRef();
  const [pagesList, setPagesList] = useState({list: []})
  const academies_container = useRef();

  function getPage(event) {
    setPageNum(parseInt(event.target.id));
  }

  function getPerPage(event) {
    let val = parseInt(event.target.value);
    if (val <= 1000 && val >= 10) {
      setPerPage(val);
      setPageNum(1);
    }
  }

  async function getAcademies() {
    const response = await fetch(`http://127.0.0.1:8000/academies/?page_num=${pageNum}&per_page=${perPage}
    ${(!isNaN(parseInt(count.current)) && count.current > 0)? `&count=${count.current}`: ''}
    `);
    const data = await response.json();
    console.log(data)
    // let modifiedAcademies = { ...academies };
    // modifiedAcademies[`${pageNum}`] = data.page_objects;
    setAcademies({data: data.page_objects});
    setPagesList({list: data.pages_list})
    num_pages.current = data.num_pages;
    count.current = data.count
  }

  useEffect(() => {
    getAcademies();
  }, [pageNum, perPage])

  return (
    <>
      <ul ref={academies_container}></ul>

      <div className="per-page-text d-flex gap-3">
        أدخل عدد العناصر في الصفحة الواحد :
        <input type="number" name="per-page" id="per-page" max={1000} min={10} onBlur={getPerPage} />
      </div>

      <div className="pages_nums d-flex gap-3">
        {
          pagesList.list.map((page, index) => {
            if (isNaN(parseInt(page))){
              return <div className="elipis" key={index} style={{cursor: "default"}}>...</div>
            }
            else{
              return <div className="page-num pointer" id={page} key={index} onClick={getPage}>{page}</div>
            }
          })
        }
      </div>
    </>
  )
}

export default Academies