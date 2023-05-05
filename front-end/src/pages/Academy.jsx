import React, { createContext, useEffect, useContext, useRef, memo, useState } from "react"
import { NavLink, Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { domainURL } from '../getEnv'
import '../style/pages/academy.css'
import { ToggleButton, Heading } from "../components/CustomComponents";

class LinkContent{
    constructor(text, url) {
        this.text = text;
        this.url = url
    }
}

async function getAcademy({ id, slug } = {}) {
    const response = await fetch(`${domainURL}/academy/${slug}/${id ? `?id=${id}` : ''}`, { method: 'GET', credentials: 'include' });
    if (response.status !== 200) {
        throw response;
    }
    const data = await response.json();
    return data
}

export async function academyLoader({ params, request }) {
    const academy = { ...window.location.state };
    delete window.location.state;
    if (academy.id) {
        const data = await getAcademy({ id: academy.id, slug: academy.slug });
        return {academy, ...data}
    }

    return await getAcademy({slug: params.academy_slug})
}

const AcademyContext = createContext()


function Academy(props) {
    const [first, setfirst] = useState('second')
    const loader = useLoaderData();
    const navigator = useNavigate()
    const renderedFirst = useRef(false);
    
    useEffect(() => {
        renderedFirst.current = true;
        loader.student_paths? navigator('learn/') : navigator('')
    }, [])
    return (
        <>
            <div className="academy position-relative">
                
                <AcademyContext.Provider value={loader}>
                    <MemoizedAcademyHeader/>
                    {renderedFirst.current? <Outlet/> : null}
                </AcademyContext.Provider>
            </div>
        </>
    )
}

function AcademyHeader() {
    const academyContext = useContext(AcademyContext);
    let mainPath;
    let links = [];
    if (academyContext.student_paths) {
        mainPath = `/academy/${academyContext.academy.slug}/learn/`;
        links = [ new LinkContent('الرئيسية', 'learn/'), new LinkContent('المقررات', 'learn/courses/') ];
    } else if (academyContext.academy_detail) {
        mainPath = `/academy/${academyContext.academy.slug}/`;
        links = [new LinkContent('الرئيسية', ''), new LinkContent('انضم إلينا', 'joinus/')]
    }
    return (
        <nav className="academy-header w-100">
            <div className="container d-flex align-items-center gap-5">
                <NavLink
                    to={mainPath}
                    className={'logo d-flex align-items-center gap-2 ms-3'}
                >
                    <img src={`${domainURL}${academyContext.academy.logo}`} alt={academyContext.academy.name} style={{ width: '120px' }} />
                    <h6 className="mb-0">{academyContext.academy.name}</h6>
                </NavLink>

                <ul className="links d-flex align-items-center justify-content-evenly flex-grow-1 flex-shrink-1 m-0">
                    {links.map((link, index) => (
                        <li key={index}>
                            <NavLink
                                to={link.url}
                                className='d-block rounded-pill px-3 py-1 transition'
                                style={({ isActive }) => (
                                    isActive ? { backgroundColor: academyContext.academy.theme_color, color: '#fff' } : null)}
                            >
                                {link.text}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div>
                    <ToggleButton func={()=>console.log('asdf')} background={academyContext.academy.theme_color} height={'35px'} width={'35px'} spansWidth={'60%'}/>
                </div>
            </div>
            <span className="d-block w-100" style={{backgroundColor: academyContext.academy.theme_color}}></span>
        </nav>
    )
}

const MemoizedAcademyHeader = memo(AcademyHeader)
function Learn() {
    return <>
        study
        <Outlet/>
    </>
}
function AcademyHome() {
    const academyContext = useContext(AcademyContext)
    return (
        <>
            <div
                className="academy-landing d-flex align-items-center justify-content-center position-relative overlay"
                style={{
                    backgroundImage: `url(${domainURL}${academyContext.academy_detail.landing_photo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="content position-realtive z-1 text-light">
                    <h1 className="text-center text-bold m-0 mb-4">{academyContext.academy.name}</h1>
                    <p className="mob-txt-home q-my-xl text-center q-mx-auto mb-4">{academyContext.academy_detail.description}</p>
                    <div className="text-center ">
                        <NavLink to={`/academy/${academyContext.academy.slug}/joinus/`} className="py-1 px-5 rounded-pill" style={{backgroundColor: academyContext.academy.theme_color}}>انضم إلينا</NavLink>
                    </div>
                </div>
            </div>
            <div className="features section gray-back">
                <Heading
                    content={'ما تقدمه الأكاديمية'} margin={'auto'}
                    colors={{ hrBackground: academyContext.academy.theme_color}}
                />
                <div className="container row m-0">
                    {
                        academyContext.features.map((feature) => (
                            <div className="box col-sm-12 col-md-6 mt-4" key={feature.id}>
                                <div className="feature bg-white h-100 d-flex  gap-3 transition position-relative" key={feature.id}>
                                    <i className="fa-regular fa-pen-to-square" style={{color:academyContext.academy.theme_color, fontSize:20}}></i>
                                    <p className="mb-0">
                                        {feature.feature}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

function JoinUs() {
    return <div style={{height:10000}}>join us</div>
}
export { Learn, AcademyHome , JoinUs } 
export default Academy


