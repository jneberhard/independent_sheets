"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteSongButtonProps = {
  songId: string;
  onDeleted?: () => void;
};

export default function DeleteSongButton({ songId, onDeleted }: DeleteSongButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this song? This action cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);

    // Attempts to delete song
    try {
      const response = await fetch(`/api/sheet-music/${songId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete the song.");
      };

      if (onDeleted) {
        onDeleted();
      };

      router.refresh();
      
      // If successful, push user to the dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error("Error deleting song:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    };
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-50 hover:bg-red-200 text-red-900 font-medium rounded transition disabled:opacity-50 my-5 border border-red-500"
    >
      {isDeleting ? "Deleting..." : "Delete Song"}
    </button>
  );
}