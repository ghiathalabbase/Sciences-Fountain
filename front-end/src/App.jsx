import { useEffect, useState } from 'react'
import { UserContextProvider } from './context/UserContext';
import { Outlet } from 'react-router-dom'
import Header from './layout/Header'
async function appLoader() {
  const userInfo = await (await (await fetch('http://127.0.0.1:8000/profile/',{method:'GET', credentials:'include'})).json());
  console.log(userInfo)
  return userInfo
}
function App() {
  return (
    <UserContextProvider>
      <Header />
      <div className='container'>
        <Outlet/>
      </div>
    </UserContextProvider>
  )
}

export default App
export {appLoader}