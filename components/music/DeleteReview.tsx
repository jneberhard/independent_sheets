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

  // Handles deletion logic of specific review. Done here rather than in api
  // for performance reasons
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    setIsDeleting(true);

    // Attempts to delete review
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
      
      // If successful, reload
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
      className="text-sm bg-red-600 text-white hover:bg-red-800 disabled:opacity-50 px-2.5 py-1 rounded-md font-medium transition"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}