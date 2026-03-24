"use client";

import dynamic from "next/dynamic";

const EditLocationFull = dynamic(
  () => import("../../../../components/EditLocationFull"),
  { ssr: false },
);

export default function Page() {
  return <EditLocationFull />;
}
