import React, {useState, useEffect, useRef} from 'react'
import "../style/components/paginator.css"
import { domainURL } from '../getEnv';


function Paginator({api_path, returnObjects, can_change_per_page, per_page}) {
    // const [objects, setObjects] = useState({data: []});
    const [pageNum, setPageNum] = useState(1);
    const [perPage, setPerPage] = useState(per_page);
    const [pagesList, setPagesList] = useState({list: []});
    const num_pages = useRef();
    const count = useRef();
    let academies_dict = useRef({});

    function getPage(event) {
        let id = parseInt(event.target.id);
        setPageNum(id);
    }

    function getPerPage(event) {
        let val = parseInt(event.target.value);
        if (val <= 1000 && val >= 10) {
            setPerPage(val);
            setPageNum(1);
            academies_dict.current = {}
        }
    }

    async function getObjects() {
        let prev_data = academies_dict.current[pageNum];
        if (prev_data) {
            returnObjects(prev_data.page_objects);
            setPagesList({list: prev_data.pages_list});
            return;
        }
        const response = await fetch(`${domainURL}${api_path}?page_num=${pageNum}&per_page=${perPage}${(!isNaN(parseInt(count.current)) && count.current > 0)? `&count=${count.current}`: ''}`);
        const data = await response.json();
        returnObjects(data.page_objects);
        setPagesList({list: data.pages_list});
        num_pages.current = data.num_pages;
        count.current = data.count;
        academies_dict.current[pageNum] = {page_objects: data.page_objects, pages_list: data.pages_list};
        if (Object.keys(academies_dict.current).length * perPage >= 2500) {
            academies_dict.current = {}
        }
    }

    function refreshSelectedNum() {
        let pg_nums = document.getElementsByClassName("page-num");
        for(let pg_elt of pg_nums) {
            pg_elt.classList.remove("primary-bgcolor");
            pg_elt.classList.remove("text-light");
            pg_elt.classList.remove("active");
        }
        let selected_page = document.getElementById(pageNum);
        if (!(selected_page === null)){
            selected_page.classList.add("primary-bgcolor");
            selected_page.classList.add("text-light");
            selected_page.classList.add("active");
        }
    }

    function changePage(event) {
        if (event.target.classList.contains("page-next")){
            if (pageNum == num_pages.current) 
                return
            setPageNum(pageNum + 1);
        }
        else{
            if (pageNum == 1)
                return
            setPageNum(pageNum - 1);
        }
    }
    
    useEffect(() => {
        getObjects();
    }, [pageNum, perPage])
    
    useEffect(() => {
        refreshSelectedNum();
    }, [pagesList])

    let common_classes = "rounded-circle d-flex justify-content-center align-items-center transition";
    return (
        <>
        <div className="content d-flex flex-column gap-4">
            {can_change_per_page
            ?
            (
            <div className="per-page-content align-items-center d-flex gap-4">
                <div className="text-label">
                    أدخل عدد العناصر في الصفحة الواحد :
                </div>
                <input className='form-control fit-content' type="number" name="per-page" id="per-page" max={1000} min={10} onBlur={getPerPage} />
            </div>
            )
            :
            ("")
            }
            <div className="paginator-container d-flex gap-2 align-items-center">
                {<div className={`page-arrow page-back shadow bg-white p-4 pointer ${common_classes}`} onClick={changePage}><i className="fa-solid fa-angle-right page-back" onClick={changePage}></i></div>}

                <div className="paginator-list d-flex gap-2 bg-white shadow rounded-pill fit-content">
                    {
                        pagesList.list.map((page, index) => {
                        if (isNaN(parseInt(page))){
                            return <div className={`pg-elt elipis m-auto ${common_classes}`} key={index} style={{cursor: "default"}}>...</div>
                        }
                        else{
                            return <div className={`pg-elt page-num pointer m-auto ${common_classes}`} id={page} key={index} onClick={getPage}>{page}</div>
                        }
                    })
                    }
                </div>

                {<div className={`page-arrow page-next shadow bg-white p-4 pointer ${common_classes}`} onClick={changePage}><i className="fa-solid fa-angle-left page-next" onClick={changePage}></i></div>}
            </div>
        </div>
        </>
    )
}

Paginator.defaultProps = {
    can_change_per_page: 0,
    per_page: 100
}

export default Paginator