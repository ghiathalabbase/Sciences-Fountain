import React, {useState, useEffect, useRef} from 'react';
import Paginator from '../components/Paginator';
import { NavLink } from 'react-router-dom';

function Academies(props) {
  const [academies, setAcademies] = useState({data: []});
  const setRetrunedObjects = (objectsList) => {
    setAcademies({data: objectsList});
  }
  return(
    <>
    <div className="container">
      <Paginator apiPath={"/academies/"} returnObjects={setRetrunedObjects}/>
      {
        academies.data.map((academy, index) => {
          return <NavLink className={"secondary-hover-bgcolor d-block my-3"} key={academy.id} onClick={()=>window.location.state=academy} to={`/academy/${academy.slug}/`}>{academy.name}</NavLink>
        })
      }
    </div>
    </>
  )
}

export default Academies;