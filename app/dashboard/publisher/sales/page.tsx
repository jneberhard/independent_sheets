import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { SalesReportClient } from "@/components/sales/SalesReportClient";

export default async function SalesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  const songs = await prisma.sheetMusic.findMany({
    where:
      user.role.name === "ADMIN"
        ? {}
        : {
            artistId: user.id,
          },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return <SalesReportClient songs={songs} />;
}