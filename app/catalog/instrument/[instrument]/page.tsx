import { CategoryGroup } from "@prisma/client";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";

type InstrumentCatalogPageProps = {
  params: Promise<{
    instrument: string;
  }>;
};

export default async function InstrumentCatalogPage({
  params,
}: InstrumentCatalogPageProps) {
  const { instrument } = await params;

  return (
    <CategoryCatalogPage
      group={CategoryGroup.INSTRUMENT}
      slug={instrument}
      heading="Instrument"
    />
  );
}
