import {
  createContext,
  Component,
  useState,
  useEffect
} from "react";
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
  console.log(userContext.user)
  useEffect(() => {
    async function getUserInfo() {
      try {
        const data = await ( await fetch('http://127.0.0.1:8000/auth/profile', {method: 'GET',credentials: 'include'})).json();
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
// class MainContextComponent extends Component{
//   constructor(props) {
//     super(props)
//     this.state = { userInfo: null, setUserInfo: this.setUserInfo}
//   }
//   setUserInfo = (data) => {
//     this.setState({ ...this.state, userInfo: data })
//   }
//   componentDidMount() {
//     const getUserInfo = async() => {
//       const userInfo = await (
//         await fetch('http://127.0.0.1:8000/profile/', {
//           method: 'GET', credentials: 'include'
//         })
//       ).json();
//       this.setUserInfo(userInfo)
//     }
//     getUserInfo()
//   }
//   render() {
//     console.log(this.state.userInfo)
//     return (
//       <MainContext.Provider value={this.state}>
//         {this.props.children}
//       </MainContext.Provider>
//     )
//   }
// }
export {UserContext, UserContextProvider}