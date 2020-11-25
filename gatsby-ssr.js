import React from "react";
import PageWrapper from "./src/components/PageWrapper";

export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>;
};
