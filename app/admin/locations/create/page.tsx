"use client";
import dynamic from "next/dynamic";

const LocationDrawMap = dynamic(
  () => import("../../../components/LocationDrawMap"),
  { ssr: false },
);

export default function Page() {
  return <LocationDrawMap />;
}
