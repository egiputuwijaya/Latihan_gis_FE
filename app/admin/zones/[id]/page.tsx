"use client";

import dynamic from "next/dynamic";

const ZoneDetailMap = dynamic(
  () => import("../../../components/ZoneDetailMap"),
  { ssr: false },
);

export default function Page() {
  return <ZoneDetailMap />;
}
