import { useEffect, useState } from 'react'
import { UserContextProvider } from './context/UserContext';
import { Outlet } from 'react-router-dom'
import Header from './layout/Header'

function App() {
  return (
    <UserContextProvider>
      <Header />
        <Outlet/>
    </UserContextProvider>
  )
}

export default App