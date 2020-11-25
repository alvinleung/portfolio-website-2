import React from 'react';
import style from './Footer.module.scss';

interface Props {}

export const Footer: React.FC<Props> = () => {
  return (
    <footer className={style.footer + ' full-width'}>
      <div>Seeking for 2021 Spring Internship</div>
      <div>alvinleung2009@gmail.com</div>
      <div className={style.footerGroup}>
        <a href="resume.pdf" target="blank">
          Resume
        </a>
      </div>
    </footer>
  );
};
