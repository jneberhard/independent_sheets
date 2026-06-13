import { CategoryGroup } from "@prisma/client";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";

type GenreCatalogPageProps = {
  params: Promise<{
    genre: string;
  }>;
};

export default async function GenreCatalogPage({
  params,
}: GenreCatalogPageProps) {
  const { genre } = await params;

  // Genre pages use the same shared layout so the browsing experience stays familiar.
  return (
    <CategoryCatalogPage
      group={CategoryGroup.GENRE}
      slug={genre}
      heading="Genre"
    />
  );
}
