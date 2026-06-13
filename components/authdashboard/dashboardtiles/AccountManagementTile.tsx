import Link from "next/link";

export default function AccountManagementTile() {
    return(
        <Link
          href="/account"
          className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black">
            Account
          </div>
          <h2 className="mt-5 text-2xl font-bold text-black">
            Account Editor
          </h2>
          <p className="mt-4 text-sm leading-7 text-black">
            Change account info and password.
          </p>
          <div className="mt-6 text-sm font-semibold text-black group-hover:underline">
            Account Management →
          </div>
        </Link>
    );
}