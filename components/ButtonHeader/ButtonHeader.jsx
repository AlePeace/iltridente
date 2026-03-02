"use client";

export const ButtonHeader = ({ menuData, menus }) => {
  const data = menuData ?? menus;

  // gestisce il caso: data = [{ menuItems: { nodes: [...] } }]
  const first = Array.isArray(data) ? data[0] : data;

  const rawItems =
    first?.menuItems?.nodes ??
    first?.nodes ??
    first?.items ??
    first?.data?.menuItems?.nodes ??
    first?.menu?.menuItems?.nodes ??
    first?.items?.edges?.map((e) => e?.node) ??
    [];

  const nodes = Array.isArray(rawItems) ? rawItems : [];

  const ctaItem = nodes.find((item) => {
    const classes = item?.cssClasses;
    if (Array.isArray(classes)) return classes.includes("cta-header");
    if (typeof classes === "string")
      return classes.split(" ").includes("cta-header");
    return false;
  });

  const bookingLabel = ctaItem?.label || "";

  console.log("ButtonHeader data:", data);
  console.log("ButtonHeader nodes:", nodes);
  console.log("ButtonHeader ctaItem:", ctaItem);

  return (
    <div>
      <button
        onClick={() => window._gstpln?.openWidget()}
        className="cursor-pointer py-2.5 px-5 bg-red text-sm text-white font-nunito font-normal rounded-lg border border-red hover:bg-red/90"
      >
        {bookingLabel}
      </button>
    </div>
  );
};
