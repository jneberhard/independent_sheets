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

  // The route stays thin on purpose: it just maps the URL to the shared page.
  return (
    <CategoryCatalogPage
      group={CategoryGroup.INSTRUMENT}
      slug={instrument}
      heading="Instrument"
    />
  );
}
