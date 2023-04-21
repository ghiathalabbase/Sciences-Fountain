import React from 'react'
import {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import "../style/pages/home.css"
import academy_logo from "../images/academy-logo.jpg"
import { Heading } from '../components/CustomComponents'
// import { domainURL } from '../getEnv'

function Home() {
  const location = useLocation()
  return (
    <>
      <div className="landing">
        <div className="landing-image position-relative overlay d-flex justify-content-center align-items-center">
          <div className="content-side col section-padding m-auto z-1 text-center">
              <h1 className='landing-header fw-bold m-0 text-light'>مؤسسة البناء</h1>
              <hr className='styled-hr mx-auto my-2' style={{width: "75px"}}/>
              <p className='main-p mb-4 lh-lg'>مركز يعتني بتسهيل العلوم وتقريبها لطلاب العلم وعموم الناس من خلال برامج ومعاهد ومنصات تتماشى مع العصري، مهتمين في ذلك بالتخصص والبناء العلمي القويم وفق منهج السلف، وتقديم الكفاءات والمتخصصين في كل علم، مع الاعتناء بتوظيف التقدم التقني والتنظيم الأكاديمي في خدمة العلم وتيسيره </p>
              <a href="/academies/" className='transition academies-link text-light fw-bold d-inline-block'>الأكاديميات</a>
          </div>
        </div>
      </div>

      <div className="academies-section section-padding">
        <div className="container">
          <Heading content={"الأكاديميات"} margin={"auto"}/>
          <div className="academies row text-center justify-content-center">
            <div className="col-lg-4 col-md-6 position-relative">
              <img src={academy_logo} className='img-fluid' />
            </div>
            <div className="col-lg-4 col-md-6 position-relative">
              <img src={academy_logo} className='img-fluid' />
            </div>
            <div className="col-lg-4 col-md-6 position-relative">
              <img src={academy_logo} className='img-fluid' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home