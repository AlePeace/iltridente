"use client"

import Link from "next/link";
import { relativeToAbsoluteUrls } from "utils/relativeToAbsoluteUrls";

export const Button = ({ url, content, className = "", onClick }) => {
  return (
    <Link
      href={relativeToAbsoluteUrls(url)}
      className={`${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    />
  );
};
