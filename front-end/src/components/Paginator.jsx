import React, {useState, useEffect, useRef} from 'react'
import "../style/components/paginator.css"
import { domainURL } from '../getEnv';


function Paginator({apiPath, returnObjects}) {
    // const [objects, setObjects] = useState({data: []});
    const [pageNum, setPageNum] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const num_pages = useRef();
    const count = useRef();
    const [pagesList, setPagesList] = useState({list: []})

    function getPage(event) {
        let id = parseInt(event.target.id);
        setPageNum(id);
    }

    function getPerPage(event) {
        let val = parseInt(event.target.value);
        if (val <= 1000 && val >= 10) {
            setPerPage(val);
            setPageNum(1);
        }
    }

    async function getObjects() {
        const response = await fetch(`${domainURL}${apiPath}?page_num=${pageNum}&per_page=${perPage}
        ${(!isNaN(parseInt(count.current)) && count.current > 0)? `&count=${count.current}`: ''}
        `);
        const data = await response.json();
        returnObjects(data.page_objects);
        setPagesList({list: data.pages_list})
        num_pages.current = data.num_pages;
        count.current = data.count
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

    useEffect(() => {
        getObjects();
    }, [pageNum, perPage])
    
    useEffect(() => {
        refreshSelectedNum();
    }, [pagesList])

    return (
        <>
        <div className="content d-flex flex-column gap-4">
            <div className="per-page-content align-items-center d-flex gap-4">
                <div className="text-label">
                    أدخل عدد العناصر في الصفحة الواحد :
                </div>
                <input className='form-control fit-content' type="number" name="per-page" id="per-page" max={1000} min={10} onBlur={getPerPage} />
            </div>
            <div className="paginator-list d-flex gap-2 bg-white shadow rounded-pill fit-content">
                {
                    pagesList.list.map((page, index) => {
                    let common_classes = "rounded-circle d-flex justify-content-center align-items-center m-auto transition"
                    if (isNaN(parseInt(page))){
                        return <div className={`pg-elt elipis ${common_classes}`} key={index} style={{cursor: "default"}}>...</div>
                    }
                    else{
                        return <div className={`pg-elt page-num pointer ${common_classes}`} id={page} key={index} onClick={getPage}>{page}</div>
                    }
                })
                }
            </div>
        </div>
        </>
    )
}
export default Paginator