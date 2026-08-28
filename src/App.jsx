import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { NavLink } from "react-router";
import useFancybox from './useFancybox';
import './App.css'
const imageModules = import.meta.glob("./assets/*.jpg", { eager: true, import: "default" });

const images = Object.entries(imageModules).map(([path, src]) => ({
  name: path.split("/").pop().split(".")[0],
  src, // ✅ this is now the resolved URL string, e.g. "/src/assets/ardbeg1-a1b2c3.jpg"
}));

console.log(images);

function Navbar() {
  return (
    <header>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>
        <NavLink to="/photography">Photography</NavLink>
      </nav>
    </header>
  )
}

function Home() {
  return (
    <>
      <section className="hero">
          <h1 className="hero__heading">Zack Cerny</h1>
          <p className="hero__text">Front-End Web Developer / Photographer</p>
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
            <a data-fancybox href={img.src} className="photoThumb">
              <img src={img.src} alt="" key={img.src} />
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