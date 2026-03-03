import { relativeToAbsoluteUrls } from "utils/relativeToAbsoluteUrls";

export const List = ({ blocks, className = "", contentClassName = "" }) => {
  return (
    <ul className={className}>
      {blocks?.map((item, index) => (
        <li className={contentClassName} key={item.id || index}>
          {item.attributes?.content && (
            <div
              dangerouslySetInnerHTML={{
                __html: relativeToAbsoluteUrls(item.attributes.content),
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};
