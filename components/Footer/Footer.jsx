import { Heading } from "components/Heading";
import { List } from "components/List";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const Footer = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const blocksByType = {
    image: innerBlocks.find((block) => block.name === "core/image"),
    paragraphs: innerBlocks.filter((block) => block.name === "core/paragraph"),
    headings: innerBlocks.filter((block) => block.name === "core/heading"),
    lists: innerBlocks.find((block) => block.name === "core/list"),
  };

  const { headings, paragraphs } = blocksByType;

  // Usa un array per ordine prevedibile
  const headingLabels = [
    "titleExplore",
    "titleContacts",
    "linkMaps",
    "linkTel",
    "linkEmail",
    "titleHours",
    "titleBreak",
    "hoursBreak",
    "titleLunch",
    "hoursLunch",
    "titleDinner",
    "hoursDinner",
    "titleBar",
    "hoursBar",
    "linkPrivacy",
    "linkCookies",
    "iconInsta",
    "iconFacebook",
    "iconYoutube",
  ];

  const paragraphLabels = ["description", "copyright"];

  const paragraphMap = Object.fromEntries(
    paragraphLabels.map((label, idx) => [label, paragraphs[idx]]),
  );

  const headingMap = Object.fromEntries(
    headingLabels.map((label, idx) => [label, headings[idx]]),
  );

  return (
    <footer className="bg-red">
      <div className="w-full px-5 py-10 lg:px-16 lg:py-20 lg:grid lg:grid-cols-4 lg:gap-10">
        <div className="w-full space-y-5">
          <div className="w-3/4 mx-auto">
            {blocksByType.image && (
              <Image
                width={blocksByType.image.attributes?.width || 500}
                height={blocksByType.image.attributes?.height || 500}
                src={blocksByType.image.attributes?.url}
                alt={blocksByType.image.attributes?.alt || ""}
                quality={100}
                className="object-contain will-change-transform pointer-events-none"
              />
            )}
          </div>
          <div>
            {paragraphMap.description && (
              <Paragraph
                content={paragraphMap.description?.attributes?.content}
                className="font-nunito text-lg text-white lg:leading-loose font-normal"
              />
            )}
          </div>
        </div>
        <div className="pt-10">
          <div>
            {headingMap.titleExplore && (
              <Heading
                level={headingMap.titleExplore.attributes?.level}
                content={headingMap.titleExplore.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5">
            <List
              blocks={blocksByType.lists?.innerBlocks}
              className="space-y-2"
              contentClassName="font-nunito text-base font-medium text-white"
            />
          </div>
        </div>
        <div className="pt-10">
          <div>
            {headingMap.titleContacts && (
              <Heading
                level={headingMap.titleContacts.attributes?.level}
                content={headingMap.titleContacts.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5 flex items-start gap-3">
            <div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_117_3329)">
                  <path
                    d="M14.6613 7.33114C14.6613 10.9915 10.6006 14.8037 9.23707 15.981C9.11004 16.0766 8.95541 16.1282 8.79647 16.1282C8.63754 16.1282 8.48291 16.0766 8.35588 15.981C6.99231 14.8037 2.93164 10.9915 2.93164 7.33114C2.93164 5.77569 3.54954 4.28395 4.64941 3.18408C5.74928 2.08421 7.24102 1.46631 8.79647 1.46631C10.3519 1.46631 11.8437 2.08421 12.9435 3.18408C14.0434 4.28395 14.6613 5.77569 14.6613 7.33114Z"
                    stroke="#7FC4DC"
                    strokeWidth="1.46621"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.79697 9.53046C10.0116 9.53046 10.9963 8.5458 10.9963 7.33115C10.9963 6.1165 10.0116 5.13184 8.79697 5.13184C7.58232 5.13184 6.59766 6.1165 6.59766 7.33115C6.59766 8.5458 7.58232 9.53046 8.79697 9.53046Z"
                    stroke="#7FC4DC"
                    strokeWidth="1.46621"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_117_3329">
                    <rect width="17.5945" height="17.5945" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {headingMap.linkMaps && (
              <Heading
                level={headingMap.linkMaps.attributes?.level}
                content={headingMap.linkMaps.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2 flex items-start gap-3">
            <div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_117_3336)">
                  <path
                    d="M10.1409 12.1462C10.2923 12.2157 10.4629 12.2316 10.6245 12.1912C10.7862 12.1508 10.9292 12.0566 11.0301 11.924L11.2904 11.5831C11.427 11.4011 11.6041 11.2533 11.8077 11.1515C12.0112 11.0497 12.2357 10.9967 12.4634 10.9967H14.6627C15.0515 10.9967 15.4245 11.1511 15.6994 11.4261C15.9744 11.7011 16.1289 12.074 16.1289 12.4629V14.6622C16.1289 15.051 15.9744 15.424 15.6994 15.699C15.4245 15.9739 15.0515 16.1284 14.6627 16.1284C11.1629 16.1284 7.80649 14.7381 5.33178 12.2634C2.85707 9.7887 1.4668 6.43228 1.4668 2.93252C1.4668 2.54365 1.62127 2.17072 1.89624 1.89575C2.17121 1.62078 2.54414 1.46631 2.93301 1.46631H5.13232C5.52118 1.46631 5.89412 1.62078 6.16908 1.89575C6.44405 2.17072 6.59853 2.54365 6.59853 2.93252V5.13183C6.59853 5.35945 6.54553 5.58395 6.44374 5.78754C6.34194 5.99113 6.19414 6.16822 6.01204 6.3048L5.66895 6.56212C5.53436 6.66488 5.4395 6.81107 5.40048 6.97584C5.36146 7.14062 5.38068 7.31382 5.45488 7.46603C6.4568 9.50103 8.10463 11.1468 10.1409 12.1462Z"
                    stroke="#7FC4DC"
                    strokeWidth="1.46621"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_117_3336">
                    <rect width="17.5945" height="17.5945" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {headingMap.linkTel && (
              <Heading
                level={headingMap.linkTel.attributes?.level}
                content={headingMap.linkTel.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2 flex items-start gap-3">
            <div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_117_3341)">
                  <path
                    d="M16.1289 5.13184L9.53754 9.33032C9.31387 9.46024 9.05981 9.52867 8.80114 9.52867C8.54247 9.52867 8.28841 9.46024 8.06474 9.33032L1.4668 5.13184"
                    stroke="#7FC4DC"
                    strokeWidth="1.46621"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.6627 2.93262H2.93301C2.12324 2.93262 1.4668 3.58906 1.4668 4.39883V13.1961C1.4668 14.0058 2.12324 14.6623 2.93301 14.6623H14.6627C15.4724 14.6623 16.1289 14.0058 16.1289 13.1961V4.39883C16.1289 3.58906 15.4724 2.93262 14.6627 2.93262Z"
                    stroke="#7FC4DC"
                    strokeWidth="1.46621"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_117_3341">
                    <rect width="17.5945" height="17.5945" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {headingMap.linkEmail && (
              <Heading
                level={headingMap.linkEmail.attributes?.level}
                content={headingMap.linkEmail.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
        </div>
        <div className="pt-10">
          <div>
            {headingMap.titleHours && (
              <Heading
                level={headingMap.titleHours.attributes?.level}
                content={headingMap.titleHours.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5">
            {headingMap.titleBreak && (
              <Heading
                level={headingMap.titleBreak.attributes?.level}
                content={headingMap.titleBreak.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2">
            {headingMap.hoursBreak && (
              <Heading
                level={headingMap.hoursBreak.attributes?.level}
                content={headingMap.hoursBreak.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5">
            {headingMap.titleLunch && (
              <Heading
                level={headingMap.titleLunch.attributes?.level}
                content={headingMap.titleLunch.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2">
            {headingMap.hoursLunch && (
              <Heading
                level={headingMap.hoursLunch.attributes?.level}
                content={headingMap.hoursLunch.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5">
            {headingMap.titleDinner && (
              <Heading
                level={headingMap.titleDinner.attributes?.level}
                content={headingMap.titleDinner.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2">
            {headingMap.hoursDinner && (
              <Heading
                level={headingMap.hoursDinner.attributes?.level}
                content={headingMap.hoursDinner.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-5">
            {headingMap.titleBar && (
              <Heading
                level={headingMap.titleBar.attributes?.level}
                content={headingMap.titleBar.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
          <div className="pt-2">
            {headingMap.hoursBar && (
              <Heading
                level={headingMap.hoursBar.attributes?.level}
                content={headingMap.hoursBar.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
          </div>
        </div>
      </div>
      <div className="h-px bg-white w-full"></div>
      <div className="py-10 px-5 space-y-5 lg:space-y-0 lg:flex lg:justify-between">
        <div>
          {paragraphMap.copyright && (
            <Paragraph
              content={paragraphMap.copyright?.attributes?.content}
              className="font-nunito text-base font-medium text-white"
            />
          )}
        </div>
        <div>
          <div className="space-y-5 lg:space-y-0 lg:flex lg:gap-10 lg:items-center">
            {headingMap.linkPrivacy && (
              <Heading
                level={headingMap.linkPrivacy.attributes?.level}
                content={headingMap.linkPrivacy.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
            {headingMap.linkCookies && (
              <Heading
                level={headingMap.linkCookies.attributes?.level}
                content={headingMap.linkCookies.attributes?.content}
                className="font-nunito text-base font-medium text-white"
              />
            )}
            <div className="flex gap-5 items-center">
              {headingMap.iconInsta && (
                <div className="relative">
                  <div>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 17.5945C0 7.87733 7.87733 0 17.5945 0C27.3117 0 35.189 7.87733 35.189 17.5945C35.189 27.3117 27.3117 35.189 17.5945 35.189C7.87733 35.189 0 27.3117 0 17.5945Z"
                        fill="white"
                      />
                      <g clipPath="url(#clip0_117_3375)">
                        <path
                          d="M21.2602 10.2637H13.9292C11.9048 10.2637 10.2637 11.9048 10.2637 13.9292V21.2602C10.2637 23.2846 11.9048 24.9258 13.9292 24.9258H21.2602C23.2846 24.9258 24.9258 23.2846 24.9258 21.2602V13.9292C24.9258 11.9048 23.2846 10.2637 21.2602 10.2637Z"
                          stroke="#A61932"
                          strokeWidth="1.46621"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.5265 17.1327C20.617 17.7428 20.5127 18.3659 20.2287 18.9134C19.9446 19.4609 19.4951 19.9048 18.9442 20.1821C18.3932 20.4594 17.7689 20.556 17.1599 20.458C16.5509 20.36 15.9884 20.0725 15.5522 19.6363C15.1161 19.2002 14.8286 18.6376 14.7306 18.0287C14.6326 17.4197 14.7291 16.7953 15.0064 16.2444C15.2837 15.6935 15.7277 15.244 16.2752 14.9599C16.8227 14.6758 17.4458 14.5716 18.0559 14.6621C18.6783 14.7544 19.2544 15.0444 19.6993 15.4893C20.1442 15.9341 20.4342 16.5103 20.5265 17.1327Z"
                          stroke="#A61932"
                          strokeWidth="1.46621"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.625 13.5625H21.6317"
                          stroke="#A61932"
                          strokeWidth="1.46621"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_117_3375">
                          <rect
                            width="17.5945"
                            height="17.5945"
                            fill="white"
                            transform="translate(8.79688 8.79688)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <Heading
                    level={headingMap.iconInsta.attributes?.level}
                    className="absolute inset-0 flex items-center justify-center text-transparent"
                  />
                </div>
              )}
              {headingMap.iconFacebook && (
                <div className="relative">
                  <div>
                    <svg
                      width="37"
                      height="36"
                      viewBox="0 0 37 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 17.5945C0 7.87733 7.87733 0 17.5945 0H19.1151C28.8323 0 36.7096 7.87733 36.7096 17.5945V17.5945C36.7096 27.3117 28.8323 35.189 19.1151 35.189H17.5945C7.87734 35.189 0 27.3117 0 17.5945V17.5945Z"
                        fill="white"
                      />
                      <g clipPath="url(#clip0_117_3380)">
                        <path
                          d="M22.7516 10.2642H20.5523C19.5802 10.2642 18.6478 10.6503 17.9604 11.3378C17.273 12.0252 16.8868 12.9575 16.8868 13.9297V16.129H14.6875V19.0614H16.8868V24.9262H19.8192V19.0614H22.0185L22.7516 16.129H19.8192V13.9297C19.8192 13.7353 19.8965 13.5488 20.034 13.4113C20.1714 13.2738 20.3579 13.1966 20.5523 13.1966H22.7516V10.2642Z"
                          stroke="#A61932"
                          strokeWidth="1.46621"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_117_3380">
                          <rect
                            width="17.5945"
                            height="17.5945"
                            fill="white"
                            transform="translate(9.55664 8.79736)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <Heading
                    level={headingMap.iconFacebook.attributes?.level}
                    className="absolute inset-0 flex items-center justify-center text-transparent"
                  />
                </div>
              )}
              {headingMap.iconYoutube && (
                <div className="relative">
                  <div>
                    <svg
                      width="37"
                      height="36"
                      viewBox="0 0 37 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 17.5945C0 7.87733 7.87733 0 17.5945 0H19.1151C28.8323 0 36.7096 7.87733 36.7096 17.5945V17.5945C36.7096 27.3117 28.8323 35.189 19.1151 35.189H17.5945C7.87734 35.189 0 27.3117 0 17.5945V17.5945Z"
                        fill="white"
                      />
                      <path
                        d="M24.9152 10.5186H12.2996C10.5366 10.5186 9.10742 12.0362 9.10742 13.9083V22.1288C9.10742 24.0009 10.5366 25.5186 12.2996 25.5186H24.9152C26.6782 25.5186 28.1074 24.0009 28.1074 22.1288V13.9083C28.1074 12.0362 26.6782 10.5186 24.9152 10.5186Z"
                        stroke="#A61932"
                        strokeWidth="1.47"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.4922 15.5186V20.5186L21.4922 17.996L16.4922 15.5186Z"
                        stroke="#A61932"
                        strokeWidth="1.47"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Heading
                    level={headingMap.iconYoutube.attributes?.level}
                    className="absolute inset-0 flex items-center justify-center text-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
