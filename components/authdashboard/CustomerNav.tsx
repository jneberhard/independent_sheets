import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";

export default async function CustomerNav() {
    const user = await getCurrentUser();

    const userId = user?.id;

    return (
        <nav className="text-blue-800">
            <Link href={`/dashboard/purchases/${userId}`}>My Purchase History</Link>
        </nav>
    );
}