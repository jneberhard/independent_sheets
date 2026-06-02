import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface PurchaseHistoryProps {
  userId: string;
  userName: string;
}

export default async function PurchaseHistory({ userId, userName }: PurchaseHistoryProps) {
    const purchases = await prisma.purchase.findMany({
        where: {
            buyerId: userId,
        },
        include: {
            sheetMusic: {
                include: {
                    artist: true,
                },
            },
        },
        orderBy: {
            purchasedAt: "desc",
        },
    });

    return (
        <div className="text-left text-gray-800">
            <h3 className="text-2xl font-semibold text-gray-900">
                Purchase History
            </h3>

            {purchases.length === 0 ? (
                <p className="mt-3">
                    No purchases yet for {userName}. Once you buy sheet music, it will show here.
                </p>
            ) : (
                <div className="mt-6 space-y-4">
                    {purchases.map((purchase) => (
                        <div
                            key={purchase.id}
                            className="rounded-2xl border bg-white p-5 shadow-sm"
                        >
                            <h4 className="text-lg font-semibold text-gray-900">
                                {purchase.sheetMusic.title}
                            </h4>

                            <p className="mt-1 text-sm text-gray-600">
                                By {purchase.sheetMusic.artist.name ?? purchase.sheetMusic.artist.email}
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                                Purchased on {purchase.purchasedAt.toLocaleDateString("en-ZA")}
                            </p>

                            <div className="mt-4">
                                <Link
                                    href={`/api/sheet-music/${purchase.sheetMusicId}/download`}
                                    className="inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                                >
                                    Download PDF
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
