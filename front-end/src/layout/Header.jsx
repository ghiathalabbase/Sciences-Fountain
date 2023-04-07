import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import avatar from '../assets/avatar.svg'
function Header() {
  const [profileImg, setProfileImg] = useState()
  let userContext = useContext(UserContext);
  useEffect(() => {
    try {
      if (!profileImg) {
        setProfileImg(userContext.user.profile_image);
      }
    } catch {
      return
    }
  }, [userContext])
  function logout() {
    fetch('http://127.0.0.1:8000/auth/logout', { credentials: 'include' });
  }
  return (
    <header className='mb-5'>
      <div className='container d-flex justify-content-between align-items-center pt-3 pb-3'>
        <NavLink to='/' ><h1 className='logo m-0'>Logo</h1></NavLink>
        
        <nav className='d-flex align-items-center gap-3'>
          <ul className='d-flex gap-3 m-0 fs-5'>
            <li><NavLink to='/' >Home</NavLink></li>
            <li><NavLink to='/stores' >Stores</NavLink></li>
            <li><NavLink to='' >Categories</NavLink></li>
            <li><NavLink to='' >Products</NavLink></li>
            <li><NavLink to='' >Contact Us</NavLink></li>
            <li><NavLink to='' >About Us</NavLink></li>
            {userContext.user.is_authenticated === true?<li><a onClick={logout} href="/">Logout</a></li>:null}
          </ul>
          <NavLink to={userContext.user.is_authenticated === true?'profile/': 'login/'} className='profile'><span></span><img src={profileImg? `http://127.0.0.1:8000${profileImg}`: avatar} alt="profile" className='rounded-pill'/></NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header