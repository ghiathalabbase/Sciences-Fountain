import React, { useState, useEffect, useRef } from "react";
import { Paginator, paginatorLoader } from "../components/Paginator";
import { NavLink, useLoaderData } from "react-router-dom";
import '../style/pages/academies.css';
import { domainURL } from "../getEnv";

export async function academiesLoader() {
    let paginator_loader = await paginatorLoader({ apiPath: "/academies/", perPage: 18 });
    const types_response = await fetch(`${domainURL}/types/`);
    const types = await types_response.json();
    return {paginator_loader: paginator_loader, types_data: types};
}

function renderAcademyBox(academy) {
    return (
        <NavLink className={"col-lg-4 col-sm-6 mt-0 mb-3"} key={academy.id} onClick={()=>window.location.state=academy} to={`/academy/${academy.slug}/`}>
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
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

function Academies() {
    const loader_data = useLoaderData();
    let [paginatorData, setPaginatorData] = useState(loader_data.paginator_loader);
    let academies = paginatorData.page_objects;
    let types = useRef(loader_data.types_data);
    let apiPath = useRef("/academies/");
    const filters = useRef({});
    const dataIsFiltered = useRef(0);
    const defaultPerPage = 18;
    
    const applyFilters = (filterd_data) => {setPaginatorData(filterd_data)};
    const updateDataIsFiltered = () => {dataIsFiltered.current = 0};
    
    async function onFilterChange(filters) {
        let stringifiedFilters = "";
        for(let filter_name of Object.keys(filters)) {
            let filter_value = filters[filter_name];
            stringifiedFilters += filter_value ? `&${filter_name}=${filter_value}` : "";
        }
        const response = await fetch(`${domainURL}${apiPath.current}${!isNaN(parseInt(defaultPerPage)) ? `?per_page=${defaultPerPage}` : ""}${stringifiedFilters}`);
        if (response.status !== 200) throw response;
        const data = await response.json();
        dataIsFiltered.current = 1;
        applyFilters({...data, perPage: defaultPerPage, filters: stringifiedFilters});
    }

    function onNameChange(ev) {
        let name_value = ev.target.value;
        if (!isNaN(parseInt(name_value)) || name_value.length > 80) return
        filters.current = {...filters.current, name: name_value}
        onFilterChange(filters.current)
    }
    function onTypeChange(ev) {
        let select_value = parseInt(ev.target.value);
        if (isNaN(select_value)) return;
        if (select_value < 0) select_value="";
        filters.current = {...filters.current, academy_type_id: select_value};
        onFilterChange(filters.current);
    }
    function onRateChange(ev) {
        let input_value = parseFloat(ev.target.value).toFixed(1);
        if (input_value < 0 || input_value > 5) return;
        if (isNaN(input_value)) input_value="";
        filters.current = {...filters.current, rate: input_value};
        onFilterChange(filters.current);
    }

    return(
        <>
        <div className="academies-landing-page">
            <div className="landing-image position-relative overlay d-flex align-items-center">
                <h1 className='container landing-header position-relative z-2'>الأكادميات</h1>
            </div>
        </div>
        <div className="main-content container section-padding">
            <div className="filters-button d-md-none rounded fw-bold pointer mb-3 fit-content transition" onClick={() => {
                document.querySelector('.filters-section').classList.toggle("open")
            }}>
                الفلاتر
                <i className="fa-solid fa-sliders me-2"></i>
            </div>
            <div className="main-content justify-content-center row">
                <div className="filters-section z-3 transition col-md-3">
                    <div className="heading d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h3 className='fw-semibold'>الفلاتر</h3>
                            <hr className='styled-hr mx-auto mt-2 me-0' style={{width: "100px"}}/>
                        </div>
                        <div className="close-filters d-md-none fw-bold pointer ms-3 fit-content transition text-light primary-bgcolor rounded" onClick={() => {
                            document.querySelector('.filters-section').classList.toggle("open")
                        }}>
                            إغلاق
                        </div>
                    </div>
                    <div className="academy-name mb-3">
                        <div className='w-100 mb-1'>اسم الأكادمية : </div>
                        <input onBlur={onNameChange} type="text" id="ac_name" name='ac_name' className="form-control" />
                    </div>
                    <div className="select-academy-type mb-4">
                        <div className='d-inline-block mb-1'>نوع الأكادمية : </div>
                        <select onChange={onTypeChange} defaultValue={-1} className="form-select form-select" id='academy-type' name='academy-type'>
                            <option value={-1}>الكل</option>
                            {types.current.map((type, index) => {
                                {return <option key={index} value={type.id}>{type.ac_type}</option>}
                            })}
                        </select>
                    </div>
                    <div className="rate-range">
                        <div className="rate-range-min">
                            <div className='w-100 mb-1'>الحد الأدنى للتقييم : </div>
                            <input onBlur={onRateChange} min="0" max="5" step={0.1} type="number" id="typeNumber" name='min-rate' className="form-control w-100 min-rate" />
                        </div>
                    </div>
                </div>
                <div className="academies-section row col-md-9">
                    {
                    academies.map((academy, index) => {
                        return (
                            renderAcademyBox(academy)
                        )
                    })
                    }
                    <div className="paginator my-5 d-flex justify-content-center">
                        <Paginator
                            loader={paginatorData}
                            apiPath={apiPath.current}
                            setNewData={(newData) => {setPaginatorData(newData)}}
                            dataIsFiltered={dataIsFiltered.current}
                        />
                    </div>
                </div>
            </div>
        </div>
        {updateDataIsFiltered()}
        </>
    )
}

export default Academies;