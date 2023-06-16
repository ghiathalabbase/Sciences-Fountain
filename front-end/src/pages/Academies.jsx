import React, {useState, useEffect, useRef} from 'react';
import Paginator from '../components/Paginator';
import { NavLink, useLoaderData } from 'react-router-dom';
import '../style/pages/academies.css';
import { domainURL } from '../getEnv';
import { Heading } from '../components/CustomComponents';


function renderAcademyBox (academy) {
  return (
    <NavLink className={"col-4 mt-0 mb-3"} key={academy.id} onClick={()=>window.location.state=academy} to={`/academy/${academy.slug}/`}>
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

export async function loader() {
  const response = await fetch(`${domainURL}/types/`);
  const data = await response.json();
  return data;
}

function Academies(props) {
  const [academies, setAcademies] = useState({data: []});
  const setRetrunedObjects = (objectsList) => {
    setAcademies({data: objectsList});
  }
  const types = useRef(useLoaderData());

  return(
    <>
    <div className="academies-landing-page">
      <div className="landing-image position-relative overlay d-flex align-items-center">
        <h1 className='container landing-header position-relative z-3'>الأكادميات</h1>
      </div>
    </div>
    <div className="main-content container section-padding">
        <div className="paginator my-5">
          <Paginator api_path={"/academies/"} returnObjects={setRetrunedObjects} per_page={25}/>
        </div>
        <div className="main-content row">
          <div className="filters-section col-3">
            <div className="heading">
              <h3 className='fw-semibold'>الفلاتر</h3>
              <hr className='styled-hr mx-auto mt-2 mb-5 me-0' style={{width: "100px"}}/>
            </div>
            <div className="select-academy-type mb-4">
              <div className='d-inline-block mb-1'>نوع الأكادمية : </div>
              <select defaultValue={null} className="form-select form-select" id='academy-type' name='academy-type'>
                <option>اختر النوع</option>
                {types.current.map((type, index) => {
                  {return <option key={index} value={type.id}>{type.ac_type}</option>}
                })}
              </select>
            </div>
            <div className="rate-range">
              <div className='mb-1'>التقييم : </div>
              <div className="rate-range-min d-flex align-items-center mb-1">
                <div className='w-100'> الحد الأدنى: </div>
                <input min="0" max="5" step={0.1} type="number" id="typeNumber" className="form-control" />
              </div>
              <div className="rate-range-min d-flex align-items-center">
                <div className='w-100'> الحد الأعلى: </div>
                <input min="0" max="5" step={0.1} type="number" id="typeNumber" className="form-control" />
              </div>
            </div>
          </div>
          <div className="academies-section row col-9">
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
    </>
  )
}

export default Academies;