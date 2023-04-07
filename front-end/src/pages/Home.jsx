import React from 'react'
import {useState, useEffect} from 'react'
import './css/home.css'
import { useLocation } from 'react-router-dom'

function Home() {
  const location = useLocation()


  return (
    <>
      {location.state}
      Home
    </>
  )
}

export default Home