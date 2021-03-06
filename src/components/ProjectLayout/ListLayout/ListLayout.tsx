import React from 'react';
import FigureWrapper from '../FigureWrapper/FigureWrapper';
import './ListLayout.scss';

const ListLayout = (props) => {
  return (
    <FigureWrapper {...props}>
      <ul className="list-layout">
        <div className="label list-layout__label">{props.label}</div>
        {props.children.map((val, index) =>
          React.cloneElement(val, { itemNumber: index + 1 }),
        )}
      </ul>
    </FigureWrapper>
  );
};

export default ListLayout;
