import React from 'react';

export const ProjectSectionHeader: React.FC = ({ children }) => {
  return (
    <>
      <div className="article-grid__full-grid-col article-grid__section-seperator"></div>
      {children}
      {/* <div className="article-grid__primary-col article__section-description">
        As a final project in an Interface Design course at Simon Fraser
        University, our team designed, prototyped, tested and pitched an App
        idea to the class in 7 weeks.
      </div> */}
    </>
  );
};

export const SectionNumber: React.FC = ({ children }) => {
  return (
    <div className="article-grid__side-col article__section-number">
      {children}
    </div>
  );
};

export const SectionTitle: React.FC = ({ children }) => {
  return (
    <h2 className="article-grid__primary-col article__section-header">
      {/* Project Context */}
      {children}
    </h2>
  );
};

export const SectionDescription: React.FC = ({ children }) => {
  return (
    <p className="article-grid__primary-col article__section-description">
      {/* Project Context */}
      {children}
    </p>
  );
};
