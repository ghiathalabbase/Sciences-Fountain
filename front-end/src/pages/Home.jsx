import React from 'react'
import {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import "../style/pages/home.css"
import { Heading } from '../components/CustomComponents'
import { domainURL } from '../getEnv'
import Slider from '../components/Slider'


function Home() {
  const location = useLocation();
  const [academies, setAcademies] = useState([])

  async function getAcademies() {
    let response = await fetch(`${domainURL}/academy-list/`);
    let data = await response.json();
    setAcademies(data.academies);
  }

  function renderAcademy(data) {
    return (
      <>
      {
      <div className="academy-item transition">
        <a href={domainURL+`/academy/${data.slug}`+`/`}>
          {<img src={domainURL+data.logo} className='img-fluid' alt={data.name}/>}
        </a>
      </div>
      }
      </>
    )
  }

  useEffect(() => {
    getAcademies();
  }, [])
  
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
            <Slider objects={academies} renderItem={renderAcademy}/>
          </div>
          <div className="more-link text-center">
            <a href="/academies/" className='transition text-light fw-bold d-inline-block static-button my-4 mx-auto'>المزيد</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home