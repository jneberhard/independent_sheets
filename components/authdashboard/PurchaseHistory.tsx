import Link from "next/link";

interface PurchaseHistoryProps {
  userId: string;
  userName: string;
}

export default async function PurchaseHistory({ userId, userName }: PurchaseHistoryProps) {

    return (
        <div className="text-gray-800">
            <p>Purchase history for {userName} will be here!</p>
            <p>More data will be populated here once this is built</p>
        </div>
    );
}