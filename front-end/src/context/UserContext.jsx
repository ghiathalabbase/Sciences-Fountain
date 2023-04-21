import {
  createContext,
  Component,
  useState,
  useEffect
} from "react";
import { domainURL } from "../getEnv";

const UserContext = createContext();
function UserContextProvider(props) {
  const [userContext, setUserContext] = useState({
    user: {
      id: null,
      name: null,
      gmail: null,
      prfoile_image: null,
      country: null,
      birth_date: null,
      gender:null,
      is_authenticated: null
    },
    setUser
  });

  function setUser(data) {
    setUserContext(previousUserContext=>({...previousUserContext, user:data}))
  }

  useEffect(() => {
    async function getUserInfo() {
      try {
        const data = await ( await fetch(`${domainURL}/auth/profile`, {method: 'GET',credentials: 'include'})).json();
        if (data.is_authenticated) {
          setUser(data)
        } else {
          setUserContext({...userContext,user:{...userContext.user, ...data}})
        }
      } catch {
        setUserContext({...userContext,user:{...userContext.user, is_authenticated: false}})
      }
    }
    getUserInfo()
  }, [])
  
  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  )
}

export {UserContext, UserContextProvider}