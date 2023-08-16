import { createContext, useState, useRef } from "react";

const UserContext = createContext();
function UserContextProvider(props) {
  const [userContext, setUserContext] = useState({
    user: props.value,
    setUser,
  });
  function setUser(data) {
    setUserContext((previousUserContext) => ({ ...previousUserContext, user: data }));
  }
  return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
}

const AcademyContext = createContext();
function AcademyContextProvider(props) {
  const [academyContext, setAcademyContext] = useState({
    contextData: props.value,
    setContextData: (data) => setAcademyContext({ ...academyContext, contextData: data }),
  });

  return <AcademyContext.Provider value={academyContext}>{props.children}</AcademyContext.Provider>;
}
export { UserContext, UserContextProvider, AcademyContext, AcademyContextProvider };
