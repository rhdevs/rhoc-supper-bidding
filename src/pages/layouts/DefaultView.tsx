import React from "react";

type DefaultViewProps = {
  children?: React.ReactNode;
};

const DefaultView: React.FC<DefaultViewProps> = ({ children = null }) => {
  return <div>{children}</div>;
};

export default DefaultView;
