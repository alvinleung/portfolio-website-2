import React from 'react';
import { Link } from 'gatsby';
import style from './MainNav.module.scss';

const MainNav = () => {
  return (
    <div className={style.fixedContainer}>
      <nav className={'full-width ' + style.navContainer}>
        <Link to="/" className={style.navLogo}>
          A.
        </Link>
        <Link to="/" className={style.navLink}>
          Works
        </Link>
        <Link to="/" className={style.navLink}>
          About
        </Link>
        <Link to="/" className={style.navLink}>
          Resume
        </Link>
      </nav>
    </div>
  );
};

export default MainNav;
