"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteReviewButtonProps = {
  reviewId: string;
  onDeleted?: () => void;
};

export default function DeleteReviewButton({ reviewId, onDeleted }: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete review");
      }

      if (onDeleted) { 
        onDeleted();
      };
      
      router.refresh(); 

    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 px-2.5 py-1 rounded-md font-medium transition"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}