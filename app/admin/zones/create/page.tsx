"use client";

import dynamic from "next/dynamic";

const ZoneCreateMap = dynamic(
  () => import("../../../components/ZoneCreateMap"),
  {
    ssr: false,
  },
);

export default function Page() {
  return <ZoneCreateMap />;
}
