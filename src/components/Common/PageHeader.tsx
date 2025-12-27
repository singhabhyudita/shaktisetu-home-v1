import React from "react";
import "./PageHeader.css";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="page-header-standard">
      <h1 className="text-gradient">{title}</h1>
    </div>
  );
};

export default PageHeader;
