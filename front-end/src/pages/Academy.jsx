import React, { createContext, useEffect, useContext, useRef, memo } from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { apiURL, domainURL } from "../getEnv";
import "../style/pages/academy.css";
import { ToggleButton, Heading } from "../components/CustomComponents";
import { isEmptyObject } from "../utils";
import { useState } from "react";
import { AcademyContext, AcademyContextProvider } from "../contexts";
class LinkContent {
  constructor(text, url) {
    this.text = text;
    this.url = url;
  }
}

async function getAcademy({ id, slug } = {}) {
  const response = await fetch(`${apiURL}academy/${slug}/${id ? `?academy_id=${id}` : ""}`, {
    method: "GET",
    credentials: "include",
  });
  if (response.status !== 200) {
    throw response;
  }
  const data = await response.json();
  return data;
}

async function academyLoader({ params }) {
  const academy = { ...window.location.state };
  delete window.location.state;
  if (isEmptyObject(academy)) {
    return getAcademy({ slug: params.academy_slug });
  }

  const data = await getAcademy({ id: academy.id, slug: params.academy_slug });
  data.academy = academy;
  return data;
}

function AcademyHeader() {
  const academyContext = useContext(AcademyContext);
  const linksListRef = useRef();
  let links = [new LinkContent("الرئيسة", ""), new LinkContent("الدراسة", "learn/courses/"), new LinkContent("المميزات", "learn/questions/")];
  return (
    <nav className="academy-header w-100 bg-light">
      <div className="container d-flex align-items-center gap-5 position-relative">
        <NavLink to={`/academy/${academyContext.contextData.academy.slug}/`} className={"logo d-flex align-items-center gap-2 ms-3"}>
          <img src={`${domainURL}${academyContext.contextData.academy.logo}`} alt={academyContext.contextData.academy.name} style={{ height: 50 }} />
        </NavLink>

        <ul ref={linksListRef} className="links collapsable d-flex align-items-center justify-content-evenly flex-grow-1 flex-shrink-1 m-0 transition">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.url}
                className="d-block rounded px-3 py-1 transition"
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: academyContext.contextData.academy.theme_color,
                        color: "#fff",
                      }
                    : null
                }
              >
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
        <div>
          <ToggleButton
            func={() => {
              linksListRef.current.classList.toggle("open");
            }}
            linesColor={academyContext.contextData.academy.theme_color}
          />
        </div>
      </div>
      <span className="d-block w-100" style={{ backgroundColor: academyContext.contextData.academy.theme_color }}></span>
    </nav>
  );
}
const MemoizedAcademyHeader = memo(AcademyHeader);

function Academy() {
  const loaderData = useLoaderData();

  return (
    <div className="academy animated_page position-relative">
      <AcademyContextProvider value={loaderData}>
        <MemoizedAcademyHeader />
        <Outlet />
      </AcademyContextProvider>
    </div>
  );
}

function AcademyHome() {
  const academyContext = useContext(AcademyContext);
  const isFirstRender = useRef(true);
  async function getAcademyDetails() {
    const details = await (await fetch(`${apiURL}academy/${academyContext.contextData.academy.slug}/details/?academy_id=${academyContext.contextData.academy.id}`)).json();
    academyContext.setContextData({ ...academyContext.contextData, details });
  }
  useEffect(() => {
    if (academyContext.contextData.details === undefined) {
      getAcademyDetails();
    }
    isFirstRender.current = false;
  }, []);
  if (!isFirstRender.current) {
    return (
      <>
        <div
          className="academy-landing d-flex align-items-center justify-content-center position-relative overlay"
          style={{
            backgroundImage: `url(${domainURL}${academyContext.contextData.details.landing_photo})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="content position-realtive z-1 text-light">
            <h1 className="h1-sm text-center text-bold m-0 mb-4">{academyContext.contextData.academy.name}</h1>
            <p className="mob-txt-home q-my-xl text-center q-mx-auto mb-4">{academyContext.contextData.details.description}</p>
            {academyContext.contextData.paths == null && (
              <div className="text-center">
                <NavLink
                  to={`/academy/${academyContext.contextData.academy.slug}/joinus/`}
                  className="py-1 px-5 rounded-pill"
                  style={{
                    backgroundColor: academyContext.contextData.academy.theme_color,
                  }}
                >
                  انضم إلينا
                </NavLink>
              </div>
            )}
          </div>
        </div>
        <div className="features section gray-back">
          <Heading content={"ما تقدمه الأكاديمية"} margin={"auto"} hrBackground={academyContext.contextData.academy.theme_color} hrWidth={120} />
          {/* <div className="container">
          <div className="row">
            <div className="col col-sm-6"></div>
          </div>
        </div> */}
          <div className="container">
            <div className="row">
              {academyContext.contextData.details.features.map((feature) => (
                <div className="col-sm-6 " key={feature.id}>
                  <div className="feature hidden-feature bg-white d-flex  gap-3 transition h-100 rounded-4" key={feature.id}>
                    <i
                      className="fa-regular fa-pen-to-square"
                      style={{
                        color: academyContext.contextData.academy.theme_color,
                        fontSize: 20,
                      }}
                    ></i>
                    <p className="mb-0">{feature.feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

function JoinUs() {
  return <div style={{ height: 10000 }}>join us</div>;
}
export { AcademyHome, JoinUs, AcademyContext, academyLoader };
export default Academy;
