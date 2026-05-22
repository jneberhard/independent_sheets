import { auth } from "@/lib/auth/server";
import Link from "next/link";

export default async function PurchaseHistory() {
    const { data: session } = await auth.getSession();

    const userId = session?.user?.id;
    return (
        <div>
            <p>Purchase history for {session?.user?.name} will be here!</p>
            <p>More data will be populated here once this is built</p>
        </div>
    );
}