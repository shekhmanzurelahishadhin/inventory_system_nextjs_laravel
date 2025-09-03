"use client";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../ui/Breadcrumb";

interface PageHeaderProps {
  title: string;
  breadcrumbItems: { label: string; href: string }[];
  onAdd?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbItems }) => {
  return (
    <div className="flex flex-wrap mb-6">
      <div className="w-full bg-white shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">{title}</h1>
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
