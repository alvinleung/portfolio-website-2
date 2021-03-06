import React from 'react';
import './ListLayout.scss';

const ListItem = ({ children, itemNumber, heading }) => {
  return (
    <li className="list-layout__item">
      {!heading && (
        <div className="list-layout__numbering article__section-description">
          {itemNumber}
        </div>
      )}
      {heading && (
        <div className="list-layout__heading article__section-description">
          {heading}
        </div>
      )}
      <p className="list-layout__content article__section-description">
        {children}
      </p>
    </li>
  );
};

export default ListItem;
