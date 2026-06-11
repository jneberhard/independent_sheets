import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FeaturedHome() {
    const featuredSongs = await prisma.$queryRaw`
        SELECT * FROM "SheetMusic" 
        ORDER BY RANDOM() 
        LIMIT 3
      ` as any[];

      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map((item) => {
            const formattedPrice = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.priceCents / 100);

            return (
              <Link href={`/music/${item.id}`} key={item.id} className="card-featured card-music p-3 rounded-xl bg-[var(--card)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105">
                {item.isNew && <span className="badge-new">New</span>}
                <h3 className="font-semibold text-lg mb-2 text-navy">
                  {item.title}
                </h3>
                <p className="text-sm mb-3 text-muted">
                  {item.composer || "Independent Composer"}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-purple">
                    {item.voicing || "Standard"}
                  </span>
                  <span className="text-sm font-bold text-gold">
                    {formattedPrice}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      );
}