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
    user: props.value,
    setUser
  });

  function setUser(data) {
    setUserContext(previousUserContext=>({...previousUserContext, user:data}))
  }
  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  )
}

export {UserContext, UserContextProvider}