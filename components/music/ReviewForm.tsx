"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewFormProps = {
  sheetMusicId: string;
};

export default function ReviewForm({ sheetMusicId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheetMusicId,
          reviewText,
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
      } else {
        setReviewText("");
        setRating(0);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
      
      {error && (
        <p className="text-sm font-medium text-red-600 bg-red-50 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-2xl transition-colors duration-100 focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            <span className={(star <= (hoveredRating || rating)) ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-500">
          {rating > 0 ? `${rating} / 5 stars` : "Select a rating"}
        </span>
      </div>

      <div>
        <textarea
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Leave a review..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none text-black"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}