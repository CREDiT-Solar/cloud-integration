// Component to display a series of name-value pairs
import React from "react";

export interface NameValueGroupProps {
  title: string;
  children: React.ReactNode;
}

const NameValueStack: React.FC<NameValueGroupProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default NameValueStack;
