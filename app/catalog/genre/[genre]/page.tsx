import { CategoryGroup } from "@prisma/client";

import CategoryCatalogPage from "../../CategoryCatalogPage";

type GenreCatalogPageProps = {
  params: Promise<{
    genre: string;
  }>;
};

export default async function GenreCatalogPage({
  params,
}: GenreCatalogPageProps) {
  const { genre } = await params;

  return (
    <CategoryCatalogPage
      group={CategoryGroup.GENRE}
      slug={genre}
      heading="Genre"
    />
  );
}
