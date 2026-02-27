import { relativeToAbsoluteUrls } from "utils/relativeToAbsoluteUrls";

export const Paragraph = ({ content, className = "" }) => {
  return (
    <p
      dangerouslySetInnerHTML={{ __html: relativeToAbsoluteUrls(content) }}
      className={className}
    ></p>
  );
};
