import React, {useState, useEffect, useRef} from 'react'

function Academies() {
  const [academies, setAcademies] = useState([])
  const [exhausted, setExhausted] = useState() 
  const [offset, setOffset] = useState(0)
  const academies_containter = useRef()
  let error_element;

  async function getAcademies(offset) {
    const response = await fetch(`http://127.0.0.1:8000/academies/?offset=${offset}`)
    if (response.status !== 200) {
      error_element = document.createElement('div')
      error_element.textContent = 'حصل خطأ ما'
      academies_containter.current.append(error_element)
      return
    }
    const data = await response.json()
    setAcademies(data.objects)
    setExhausted(data.exhausted)
  }
  useEffect(() => {
    // connecting to the backend server and fetching academies 
    getAcademies(offset)
    // setting academies state
  }, [])
  
  return (
    <>
      <ul ref={academies_containter}>
        {
          academies.map(academy => <div key={academy.id}>{academy.name}</div>)
        }
      </ul>
      {exhausted===false && 'المزيد'}
    </>
  )
}

export default Academies