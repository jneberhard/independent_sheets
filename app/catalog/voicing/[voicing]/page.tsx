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

  return (
    <CategoryCatalogPage
      group={CategoryGroup.VOICING}
      slug={voicing}
      heading="Voicing"
    />
  );
}
