import ZoneGrid from "@/app/components/ZoneGrid";

export default async function Page({ params }: any) {
  const { id } = await params;
  return <ZoneGrid zoneId={id} />;
}
