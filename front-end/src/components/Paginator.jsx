import React, { useState, useEffect, useRef } from "react";
import "../style/components/paginator.css";
import { domainURL } from "../getEnv";


function Paginator({ loader, apiPath, canChangePerPage, setNewData, dataIsFiltered }) {
  const [pageNum, setPageNum] = useState(1);
  const perPage = useRef(loader.perPage);
  const objects = useRef(loader.page_objects);
  const pagesList = useRef(loader.pages_list);
  const num_pages = useRef(loader.num_pages);
  const count = useRef(loader.count);
  const filters = useRef(loader.filters);
  const activeNum = useRef(1);
  const cache = useRef({ 1: { page_objects: loader.page_objects, pages_list: loader.pages_list } });
  if (dataIsFiltered) {
    perPage.current = loader.perPage;
    objects.current = loader.page_objects;
    pagesList.current = loader.pages_list;
    num_pages.current = loader.num_pages;
    count.current = loader.count;
    filters.current = loader.filters;
    activeNum.current = 1;
    cache.current = { 1: { page_objects: loader.page_objects, pages_list: loader.pages_list } };
  }

  function getPerPage(event) {
    let val = parseInt(event.target.value);
    if (val <= 1000 && val >= 10) {
      perPage.current = val;
      cache.current = {};
      getPage(1);
    }
  }

  async function getPage(page) {
    if (typeof parseInt(page) === "number") {
      let prev_data = cache.current[page];
      if (prev_data) {
        objects.current = prev_data.page_objects;
        pagesList.current = prev_data.pages_list;
        let data = {count: count.current, num_pages: num_pages.current, page_objects: objects.current, pages_list: pagesList.current};
        activeNum.current = page;
        setNewData({...data, perPage: perPage.current, filters: filters.current});
        setPageNum(page);
      }
      else {
        let params = `page_num=${page}&per_page=${perPage.current}${!isNaN(parseInt(count.current)) && count.current > 0 ? `&count=${count.current}` : ""}${filters.current}`;
        const response = await fetch(`${domainURL}${apiPath}?${params}`);
        var data = await response.json();
        objects.current = data.page_objects;
        pagesList.current = data.pages_list;
        num_pages.current = data.num_pages;
        count.current = data.count;
        cache.current[page] = { page_objects: data.page_objects, pages_list: data.pages_list };
        activeNum.current = page;
        setNewData({...data, perPage: perPage.current, filters: filters.current});
        setPageNum(page);
      }
    }
  }

  if (!objects.current.length) {
    return (
      <>
      <div className="no-objects">
        لا يوجد محتوى
      </div>
      </>
    )
  }

  const common_classes = "d-flex justify-content-center align-items-center transition";
  const common_mobile_classes = "bg-white py-2 px-4 pointer rounded shadow";
  return (
    <>
      <div className="content d-flex flex-column gap-4">
        {canChangePerPage ? (
          <div className="per-page-content align-items-center d-flex gap-4">
            <div className="text-label">أدخل عدد العناصر في الصفحة الواحد :</div>
            <input className="form-control fit-content" type="number" name="per-page" id="per-page" max={1000} min={10} onBlur={getPerPage} />
          </div>
        ) : null}

        <div className="mobile-paginator-container d-flex align-items-center d-sm-none gap-4">
          <div className={`page-text page-back ${common_mobile_classes} ${common_classes}`} onClick={() => activeNum.current > 1 && getPage(activeNum.current - 1)}>
              <div className="back-text d-sm-none d-block">السابق</div>
          </div>
          <div className="page-num-text py-2 px-4">
            {`${activeNum.current} / ${num_pages.current}`}
          </div>
          <div className={`page-text page-next ${common_mobile_classes} ${common_classes}`} onClick={() => activeNum.current < num_pages.current && getPage(activeNum.current + 1)}>
              <div className="next-text">التالي</div>
          </div>
        </div>

        <div className="paginator-container d-none d-sm-flex gap-2 align-items-center">
          <div className={`page-arrow page-back bg-white p-4 pointer rounded-circle ${common_classes}`} onClick={() => activeNum.current > 1 && getPage(activeNum.current - 1)}>
            <i className="fa-solid fa-angle-right page-back d-none d-sm-block" />
          </div>

          <div className="paginator-list d-flex gap-2 bg-white shadow rounded-pill fit-content">
            {pagesList.current.map((page, index) => {
              if (isNaN(parseInt(page))) {
                return (
                  <div className={`pg-elt elipis m-auto rounded-circle ${common_classes}`} key={index} style={{ cursor: "default" }}>
                    ...
                  </div>
                );
              } else {
                return (
                  <div
                    className={`pg-elt page-num pointer m-auto rounded-circle ${common_classes} ${page === activeNum.current ? "primary-bgcolor text-light active" : null} `}
                    id={`button-${page}`}
                    key={index}
                    onClick={() => getPage(page)}
                  >
                    {page}
                  </div>
                );
              }
            })}
          </div>

          <div className={`page-arrow page-next bg-white p-4 pointer rounded-circle ${common_classes}`} onClick={() => activeNum.current < num_pages.current && getPage(activeNum.current + 1)}>
            <i className="fa-solid fa-angle-left page-next d-none d-sm-block" />
          </div>
        </div>
      </div>
    </>
  );
}

Paginator.defaultProps = {
  canChangePerPage: 0,
  dataIsFiltered: 0,
};

async function paginatorLoader({ apiPath, perPage }) {
  const response = await fetch(`${domainURL}${apiPath}${!isNaN(parseInt(perPage)) ? `?per_page=${perPage}` : ""}`);
  if (response.status !== 200) throw response;
  const data = await response.json();
  return { ...data, perPage };
}

export { Paginator, paginatorLoader };
