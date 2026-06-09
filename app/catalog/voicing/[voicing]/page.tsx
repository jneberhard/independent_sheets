import { CategoryGroup } from "@prisma/client";

import CategoryCatalogPage from "@/components/CategoryCatalogPage";

type VoicingCatalogPageProps = {
  params: Promise<{
    voicing: string;
  }>;
};

export default async function VoicingCatalogPage({
  params,
}: VoicingCatalogPageProps) {
  const { voicing } = await params;

  // This route only chooses the voicing group and passes the work to the shared page.
  return (
    <CategoryCatalogPage
      group={CategoryGroup.VOICING}
      slug={voicing}
      heading="Voicing"
    />
  );
}
