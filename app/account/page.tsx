import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <AccountForm user={user} />;
}
