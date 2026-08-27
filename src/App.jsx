import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { NavLink } from "react-router";
import './App.css'
import './assets/pod1.jpg'


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
          <p className="hero__text">Front-End Web Developer</p>
      </section>
    </>
  )
}

function Photography() {
  return (
    <>
      <section className="photography">
        <h1>Photography</h1>
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