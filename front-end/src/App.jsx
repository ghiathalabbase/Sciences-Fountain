import { useEffect, useState } from 'react'
import { UserContextProvider } from './context/UserContext';
import { Outlet, useLoaderData } from 'react-router-dom'
import Header from './layout/Header';
import { domainURL } from "./getEnv";

export async function loader() {
  const response = await fetch(`${domainURL}/auth/profile`, { method: 'GET', credentials: 'include' });
  return response;
}
function App() {
  const loader = useLoaderData()
  return (
    <UserContextProvider value={loader}>
      <Header />
        <Outlet/>
    </UserContextProvider>
  )
}

export default App