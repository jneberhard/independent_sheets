import Link from "next/link";
import { auth } from "@/lib/auth/server";

export default async function CustomerNav() {
    const { data: session } = await auth.getSession();

    const userId = session?.user?.id;

    return (
        <nav>
            <Link href={`/dashboard/purchases/${userId}`}>My Purchase History</Link>
        </nav>
    );
}