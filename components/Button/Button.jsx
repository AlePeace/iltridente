import Link from "next/link";
import { relativeToAbsoluteUrls } from "utils/relativeToAbsoluteUrls";

export const Button = ({ url, content, className = "" }) => {
  return (
    <Link
      href={relativeToAbsoluteUrls(url)}
      className={`inline-block px-6 py-3 rounded-full transition-all duration-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
