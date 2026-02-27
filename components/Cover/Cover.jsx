import Image from "next/image";

export const Cover = ({
  children,
  background,
  className = "",
  contentClassName = "",
}) => {
  const hasBackgroundVideo = background?.backgroundVideo?.url;
  const hasBackgroundImage = background?.backgroundImage?.url;

  const img = background?.backgroundImage || {};
  const imgWidth = img.width || img.mediaDetails?.width || img?.sizes?.width;
  const imgHeight =
    img.height || img.mediaDetails?.height || img?.sizes?.height;
  const imgProps =
    imgWidth && imgHeight
      ? { width: Number(imgWidth), height: Number(imgHeight) }
      : { fill: true };

  return (
    <div
      className={`h-screen relative min-h-[400px] flex justify-center items-center overflow-hidden ${className}`}
    >
      {hasBackgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none will-change-transform"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={background?.backgroundImage?.url || undefined}
        >
          <source src={background.backgroundVideo.url} type="video/mp4" />
          Il tuo browser non supporta il video.
        </video>
      )}

      {!hasBackgroundVideo && hasBackgroundImage && (
        <Image
          src={img.url}
          alt={img.alt || "Cover background"}
          {...imgProps}
          style={{ objectFit: "cover" }}
          className="z-0"
          priority
        />
      )}

      {!hasBackgroundVideo &&
        !hasBackgroundImage &&
        background?.backgroundColor && (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: background.backgroundColor }}
          />
        )}

      {!hasBackgroundVideo &&
        !hasBackgroundImage &&
        !background?.backgroundColor && (
          <div className="absolute inset-0 z-0" />
        )}

      <div className={`max-w-5xl z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
};
