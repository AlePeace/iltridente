import Link from "next/link";
import { relativeToAbsoluteUrls } from "utils/relativeToAbsoluteUrls";

export const Button = ({ url, content, className = "" }) => {
  return (
    <Link
      href={relativeToAbsoluteUrls(url)}
      className={`${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
