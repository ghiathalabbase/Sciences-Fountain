import React, {useState, useEffect, useRef} from 'react'
import Paginator from '../components/Paginator'
function Academies(props) {
  const [academies, setAcademies] = useState({data: []});
  const setRetrunedObjects = (objectsList) => {
    setAcademies({data: objectsList})
  }
  return(
    <>
    <div className="container">
      <Paginator API_URL={"http://127.0.0.1:8000/academies/"} returnObjects={setRetrunedObjects}/>
      
    </div>
    </>
  )
}

export default Academies