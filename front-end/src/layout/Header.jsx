import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import avatar from '../images/avatar.svg'
import { domainURL } from '../getEnv';
import { ToggleButton } from '../components/CustomComponents';
import { collapse } from '../utils';
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
    fetch(`${domainURL}/auth/logout`, { credentials: 'include' });
  }

  function toggleLinksWithBtn() {
    document.querySelector('header nav .links').classList.toggle('open')
  }
  useEffect(() => {
    document.addEventListener('click', collapse);
    return () => {
      document.removeEventListener('click', collapse)
    };
  }, [])

  return (
    <header>
      <div className="container d-flex justify-content-between gap-2 gap-sm-4 align-items-center pt-2 pb-2 position-relative">
        <NavLink className='logo' to='' ><h1 className='text-white m-0'>Logo</h1></NavLink>
        
        <nav className='d-flex align-items-center gap-3 flex-grow-1 flex-shrink-1'>
          <ul className='links collapsable d-md-flex align-items-center gap-3 flex-grow-1 flex-shrink-1 m-0 px-3 px-md-0 py-2 py-md-0 fs-6 transition'>
            <li className='mb-1 mb-md-0'><NavLink to='/' >الرئيسية</NavLink></li>
            <li className='mb-1 mb-md-0'><NavLink to='academies/' >الأكاديميات</NavLink></li>
            <li className='mb-1 mb-md-0'><NavLink to='contact/' >تواصل معنا</NavLink></li>
            <li className='mb-1 mb-md-0'><NavLink to='about/' >عن المركز</NavLink></li>
            {userContext.user.is_authenticated && <li className='me-auto'><a onClick={logout} href="/">تسجيل الخروج</a></li>}
          </ul>
          <NavLink to={userContext.user.is_authenticated === true ? 'profile/' : 'login/'} className='profile p-0 me-auto'><img src={profileImg ? `http://127.0.0.1:8000${profileImg}` : avatar} alt="profile" className='rounded-pill'/></NavLink>
          <ToggleButton func={toggleLinksWithBtn}  />
        </nav>
      </div>
    </header>
  )
}

export default Header

