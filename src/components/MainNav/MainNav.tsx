import React from 'react';
import { Link } from 'gatsby';
import style from './MainNav.module.scss';

const MainNav = () => {
  return (
    <div className={style.fixedContainer}>
      <nav className={'full-width main-grid ' + style.navContainer}>
        <div className="main-grid__side-col--presist">
          <Link to="/" className={style.navLogo}>
            A.
          </Link>
        </div>
        <div
          className="main-grid__primary-col--collapsable label"
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        >
          UX/UI Designer
        </div>
        <div
          className={
            'main-grid__secondary-col main-grid__secondary-col--mobile-break ' +
            style.navLinkContainer
          }
        >
          <Link to="/" className={style.navLink}>
            Works
          </Link>
          <Link to="/about" className={style.navLink}>
            About
          </Link>
          {/* <Link to="/resume.pdf" className={style.navLink}>
            Resume
          </Link> */}
        </div>
      </nav>
    </div>
  );
};

export default MainNav;
