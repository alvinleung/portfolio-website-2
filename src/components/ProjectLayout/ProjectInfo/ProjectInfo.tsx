import React from 'react';

import './ProjectInfo.scss';

export const ProjectInfo: React.FC = ({ children }) => {
  return <div className="project-info">{children}</div>;
};

interface iItem {
  fieldName: string;
  value: string;
}
export const ProjectInfoItem: React.FC<iItem> = ({
  fieldName,
  value,
}: iItem) => {
  return (
    <div className="project-info__item">
      <div className="project-info__key">{fieldName}</div>
      <div className="project-info__entry">{value}</div>
    </div>
  );
};
