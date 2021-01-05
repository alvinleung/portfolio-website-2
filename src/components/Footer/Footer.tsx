import React from 'react';
import style from './Footer.module.scss';

interface Props {}

export const Footer: React.FC<Props> = () => {
  return (
    <footer className={style.footer + ' full-width main-grid'}>
      <div className="main-grid__full-content">
        <div>Seeking for 2021 Spring Internship</div>
        <div>alvinleung2009@gmail.com</div>
        <div className={style.footerGroup}>
          <a href="resume.pdf" target="blank">
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
};
