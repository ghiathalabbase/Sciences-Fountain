import React from 'react'
import {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import "../style/pages/home.css"

function Home() {
  const location = useLocation()


  return (
    <>
      <div className="landing bg-white row align-items-center">
        <div className="content-side col">
          <h1 className='landing-header fw-bold mb-0'>مؤسسة البناء</h1>
          <hr className='styled-hr'/>
          <p className='main-p mb-5 lh-lg'>مركز يعتني بتسهيل العلوم وتقريبها لطلاب العلم وعموم الناس من خلال برامج ومعاهد ومنصات تتماشى مع العصري، مهتمين في ذلك بالتخصص والبناء العلمي القويم وفق منهج السلف، وتقديم الكفاءات والمتخصصين في كل علم، مع الاعتناء بتوظيف التقدم التقني والتنظيم الأكاديمي في خدمة العلم وتيسيره </p>
          <a href="/academies/" className='transition academies-link text-light fw-bold d-inline-block'>الأكاديميات</a>
        </div>
        <div className="image-side col-6 d-none d-sm-block">
        </div>
      </div>
    </>
  )
}

export default Home