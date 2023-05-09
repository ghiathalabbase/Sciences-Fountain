import React, {useState, useEffect, useRef} from 'react';
import Paginator from '../components/Paginator';
import { NavLink } from 'react-router-dom';
import '../style/pages/academies.css';
import { domainURL } from '../getEnv';
import { Heading } from '../components/CustomComponents';


function renderAcademyBox (academy) {
  return (
    <NavLink className={"col-4"} key={academy.id} onClick={()=>window.location.state=academy} to={`/academy/${academy.slug}/`}>
      <div className="academy-box bg-white shadow rounded box-hover transition">
        <div className="img-container overflow-hidden">
          <img className='ac-img w-100 rounded-top' src={`${domainURL}/${academy.logo}`} alt="academy-image" />
        </div>
        <div className="academy-detail p-3">
          <div className="ac-name fw-bold">
            {academy.name}
          </div>
          <div className="ac-type-rate">
            <div className="ac-type fit-content p-1 rounded">
              {academy.academy_type}
            </div>
            {/* <div className="ac-rate">
              {academy.rate}
            </div> */}
          </div>
        </div>
      </div>
    </NavLink>
  )
}

function Academies(props) {
  const [academies, setAcademies] = useState({data: []});
  const setRetrunedObjects = (objectsList) => {
    setAcademies({data: objectsList});
  }
  return(
    <>
    <div className="container">
    {/* <Heading
        content={'الأكادميات'} margin={'0'}
        hrWidth={60}
    /> */}
      <div className="row">
        <div className="filters-section col-3"></div>
        <div className="academies-section col-9">
          <div className="paginator my-5">
            <Paginator api_path={"/academies/"} returnObjects={setRetrunedObjects} per_page={25}/>
          </div>
          <div className="main-content row">
            {
              academies.data.map((academy, index) => {
                return (
                  renderAcademyBox(academy)
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Academies;