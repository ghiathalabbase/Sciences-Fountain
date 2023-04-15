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

  function toggleLinksWithBtn(event) {
    event.stopPropagation()
    document.querySelector('header nav .links').classList.toggle('stretched')
    document.querySelector('header nav .toggle').classList.toggle('clicked')
  }
  useEffect(() => {
    function toggleLinks(event) {
      const links = document.querySelector('header nav .links');
      const toggleBtn = document.querySelector('header nav .toggle');
      if (event.target !== toggleBtn && event.target !== links) {
        links.classList.remove('stretched')
        toggleBtn.classList.remove('clicked')
      }
    }

    document.addEventListener('click', toggleLinks);
    return () => {
      document.removeEventListener('click', toggleLinks)
    };
  }, [])

  return (
    <header className='container d-flex justify-content-between gap-2 gap-sm-4 align-items-center pt-2 pb-2 position-relative'>
      <NavLink className='logo' to='' ><h1 className='text-white m-0'>Logo</h1></NavLink>
      
      <nav className='d-flex align-items-center gap-3 flex-grow-1 flex-shrink-1'>
        <ul className='links d-md-flex align-items-center gap-3 flex-grow-1 flex-shrink-1 m-0 px-3 px-md-0 py-2 py-md-0 fs-6 transition z-2'>
          <li className='mb-1 mb-md-0'><NavLink to='/' >الرئيسية</NavLink></li>
          <li className='mb-1 mb-md-0'><NavLink to='academies/' >الأكاديميات</NavLink></li>
          <li className='mb-1 mb-md-0'><NavLink to='contact/' >تواصل معنا</NavLink></li>
          <li className='mb-1 mb-md-0'><NavLink to='about/' >عن المركز</NavLink></li>
          {userContext.user.is_authenticated && <li className='me-auto'><a onClick={logout} href="/">تسجيل الخروج</a></li>}
        </ul>
        <NavLink to={userContext.user.is_authenticated === true ? 'profile/' : 'login/'} className='profile p-0 me-auto'><img src={profileImg ? `http://127.0.0.1:8000${profileImg}` : avatar} alt="profile" className='rounded-pill'/></NavLink>
        <div className='toggle d-md-none pointer' onClick={toggleLinksWithBtn}>
          <span className='d-block bg-white w-100 position-relative transition'></span>
          <span className='d-block bg-white w-100 position-relative transition'></span>
          <span className='d-block bg-white w-100 position-relative transition'></span>
        </div>
      </nav>
    </header>
  )
}

export default Header