import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import avatar from '../assets/avatar.svg'
import navbar from '../style/navbar.css'
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
    <header >
      <div className='container d-flex gap-4 align-items-center pt-2 pb-2'>
        <NavLink to='' ><h1 className='logo m-0'>Logo</h1></NavLink>
        
        <nav className='d-flex align-items-center justify-content-between gap-3 flex-grow-1 flex-shrink-1'>
          <ul className='d-flex gap-3 flex-grow-1 flex-shrink-1 m-0 fs-6'>
            <li><NavLink to='/' >الرئيسية</NavLink></li>
            <li><NavLink to='academies/' >الأكاديميات</NavLink></li>
            <li><NavLink to='contact/' >تواصل معنا</NavLink></li>
            <li><NavLink to='about/' >عن المركز</NavLink></li>
          </ul>
          {userContext.user.is_authenticated === true?<a onClick={logout} href="/">تسجيل الخروج</a>:null}
          <NavLink to={userContext.user.is_authenticated === true?'profile/': 'login/'} className='profile p-0'><span></span><img src={profileImg? `http://127.0.0.1:8000${profileImg}`: avatar} alt="profile" className='rounded-pill'/></NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header