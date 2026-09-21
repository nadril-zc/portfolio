import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { NavLink } from "react-router";
import useFancybox from './useFancybox';
import './App.css'

const photoModules = import.meta.glob("./assets/photos/*.jpg", { eager: true, import: "default" });
const thumbModules = import.meta.glob("./assets/thumbnails/*.jpg", { eager: true, import: "default" });

const images = Object.entries(photoModules).map(([path, src]) => {
  const name = path.split("/").pop().split(".")[0];

  // find the matching thumbnail by filename
  const thumbPath = Object.keys(thumbModules).find((p) =>
    p.endsWith(`/${name}.jpg`)
  );

  return {
    name,
    src,
    thumb: thumbPath ? thumbModules[thumbPath] : src, // fallback to full image if no thumb found
  };
});

function Navbar() {
  return (
    <header>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Portfolio
        </NavLink>
        <NavLink to="/photography">Photography</NavLink>
      </nav>
    </header>
  )
}

function PortfolioItem({src, type, client}) {
  return (
      <a href={src} className="portfolioItem" target="_blank">
        <span className="portfolioItem__type">{type}</span>

        <div className="portfolioItem__client">{client}</div>

        <div className="portfolioItem__arrow"></div>
      </a>
  )
}

function Home() {
  return (
    <>
      <section className="content">
        <h1 className="mainHeading">Zack Cerny <span className="small">Front-End Web Developer</span></h1>
        
        <h2 className="heading">Projects</h2>

        <PortfolioItem src="https://synchronyimpact.com/" type="Impact Report" client="Synchrony" />
        <PortfolioItem src="https://cr.whirlpoolcorp.com/" type="Corporate Responsibility Resource Center" client="Whirlpool" />
        <PortfolioItem src="https://reports.sutterhealth.org/annualreport-2025/" type="2025 Annual Report" client="Sutter Health" />
        <PortfolioItem src="https://content.tdsynnex.com/ccr/fy2025/" type="2025 Corporate Citizenship Report" client="TD Synnex" />
        <PortfolioItem src="https://www.cisco.com/c/m/en_us/about/purpose/reporting-hub.html" type="Purpose Reporting Hub" client="Cisco" />
      </section>
    </>
  )
}

// Photography section

function Photography() {
  const [fancyboxRef] = useFancybox({
    // Your custom options
  });

  return (
    <>
      <section className="photography">
        <div className="photography__photos" ref={fancyboxRef}>
          {images.map((img) => (
            <a data-fancybox="gallary" href={img.src} key={img.src} className="photoThumb">
              <img src={img.thumb} alt="" />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photography" element={<Photography />} />
      </Routes>
    </BrowserRouter>
  );
}