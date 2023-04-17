import React, {useState, useEffect, useRef} from 'react'

function Academies() {
  const [academies, setAcademies] = useState([])
  const [offset, setOffset] = useState(0)
  const academies_containter = useRef()
  let error_element;

  async function getAcademies(offset) {
    const response = await fetch(`http://127.0.0.1:8000/academies/`)
    const data = await response.json()
    console.log(data)
    // setAcademies(data.objects)
    // setExhausted(data.exhausted)
  }
  useEffect(() => {
    getAcademies(offset)
  }, [])
  
  return (
    <>
      <ul ref={academies_containter}></ul>
    </>
  )
}

export default Academies