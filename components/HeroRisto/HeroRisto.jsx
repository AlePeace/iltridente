import { Heading } from "components/Heading";
import Image from "next/image";
import Link from "next/link";
import { getBlockLink } from "utils/getBlockLink";

const ImageWrapper = ({ link, children }) => {
  if (link) {
    return (
      <Link href={link} className="h-full block">
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};

export const HeroRisto = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const images = innerBlocks.filter((block) => block.name === "core/image");
  const imgLunch = images[0];
  const imgDinner = images[1];
  const imgBreakfast = images[2];

  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const headingLunch = headings[0];
  const headingDinner = headings[1];
  const headingBreakfast = headings[2];

  const linkLunch = getBlockLink(imgLunch);
  const linkDinner = getBlockLink(imgDinner);
  const linkBreakfast = getBlockLink(imgBreakfast);

  return (
    <section>
      <div className="h-screen lg:h-[70vh] w-full flex flex-col lg:flex-row">
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh] group">
          {imgLunch && (
            <ImageWrapper link={linkLunch}>
              <div className="h-full relative overflow-hidden">
                <Image
                  width={imgLunch?.attributes?.width || 1920}
                  height={imgLunch?.attributes?.height || 1080}
                  src={imgLunch?.attributes?.url}
                  alt={imgLunch?.attributes?.alt || ""}
                  quality={100}
                  priority
                  fetchPriority="high"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-3600"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
              </div>
            </ImageWrapper>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingLunch && (
              <div className="flex flex-col items-center gap-2">
                <div>
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1955 17.5945C15.6248 17.5945 17.5941 15.6252 17.5941 13.1959C17.5941 10.7666 15.6248 8.79724 13.1955 8.79724C10.7662 8.79724 8.79688 10.7666 8.79688 13.1959C8.79688 15.6252 10.7662 17.5945 13.1955 17.5945Z"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 2.19934V4.39865"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 21.9932V24.1925"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.41992 5.42139L6.97044 6.9719"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.4199 19.4199L20.9704 20.9704"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.19922 13.1959H4.39853"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.9922 13.1959H24.1915"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.97044 19.4199L5.41992 20.9704"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.9704 5.42139L19.4199 6.9719"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Heading
                  level={headingLunch.attributes?.level}
                  content={headingLunch.attributes?.content}
                  className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh] group">
          {imgDinner && (
            <ImageWrapper link={linkDinner}>
              <div className="h-full relative overflow-hidden">
                <Image
                  width={imgDinner?.attributes?.width || 1920}
                  height={imgDinner?.attributes?.height || 1080}
                  src={imgDinner?.attributes?.url}
                  alt={imgDinner?.attributes?.alt || ""}
                  quality={100}
                  priority
                  fetchPriority="high"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-3600"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
              </div>
            </ImageWrapper>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingDinner && (
              <div className="flex flex-col items-center gap-2">
                <div>
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.0763 13.7302C22.9732 15.6394 22.3194 17.4778 21.1938 19.0233C20.0682 20.5688 18.519 21.7552 16.7335 22.439C14.948 23.1228 13.0027 23.2748 11.1327 22.8766C9.26266 22.4785 7.548 21.5472 6.19598 20.1953C4.84396 18.8434 3.91247 17.1288 3.51409 15.2589C3.11572 13.3889 3.26753 11.4435 3.95116 9.65799C4.6348 7.87245 5.821 6.32314 7.36636 5.19737C8.91173 4.07159 10.7501 3.41754 12.6593 3.31428C13.1046 3.29008 13.3377 3.82012 13.1013 4.1973C12.3105 5.46251 11.9719 6.95839 12.1408 8.44082C12.3096 9.92325 12.9759 11.3047 14.0309 12.3597C15.0859 13.4147 16.4673 14.081 17.9498 14.2498C19.4322 14.4186 20.9281 14.08 22.1933 13.2893C22.5716 13.0528 23.1005 13.2849 23.0763 13.7302Z"
                      stroke="#EFF7FA"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Heading
                  level={headingDinner.attributes?.level}
                  content={headingDinner.attributes?.content}
                  className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh] group">
          {imgBreakfast && (
            <ImageWrapper link={linkBreakfast}>
              <div className="h-full relative overflow-hidden">
                <Image
                  width={imgBreakfast?.attributes?.width || 1920}
                  height={imgBreakfast?.attributes?.height || 1080}
                  src={imgBreakfast?.attributes?.url}
                  alt={imgBreakfast?.attributes?.alt || ""}
                  quality={100}
                  priority
                  fetchPriority="high"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-3600"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
              </div>
            </ImageWrapper>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingBreakfast && (
              <div className="flex flex-col gap-2 items-center">
                <div>
                  <svg
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1955 17.5945C15.6248 17.5945 17.5941 15.6252 17.5941 13.1959C17.5941 10.7666 15.6248 8.79724 13.1955 8.79724C10.7662 8.79724 8.79688 10.7666 8.79688 13.1959C8.79688 15.6252 10.7662 17.5945 13.1955 17.5945Z"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 2.19934V4.39865"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 21.9932V24.1925"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.41992 5.42139L6.97044 6.9719"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.4199 19.4199L20.9704 20.9704"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.19922 13.1959H4.39853"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.9922 13.1959H24.1915"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.97044 19.4199L5.41992 20.9704"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.9704 5.42139L19.4199 6.9719"
                      stroke="#FFF"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Heading
                  level={headingBreakfast.attributes?.level}
                  content={headingBreakfast.attributes?.content}
                  className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
