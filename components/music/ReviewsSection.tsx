import { User, Reviews } from "@prisma/client";
import ReviewForm from "./ReviewForm";
import DeleteReviewButton from "./DeleteReview";

type ReviewWithUser = Reviews & {
  user: {
    firstName: string | null;
    lastName: string | null;
    name: string | null;
  } | null;
};

type ReviewsSectionProps = {
  sheetMusicId: string;
  reviews: ReviewWithUser[];
  currentUser: User | null;
};

export default function ReviewsSection({ sheetMusicId, reviews, currentUser }: ReviewsSectionProps) {
  // Checks to see if user's already left a review. This is to only allow
  // one review per user.
  const hasUserReviewed = reviews?.some(
    (review) => review.userId === currentUser?.id
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 pt-10">
      

      <div className="md:col-span-2 space-y-6">
        <h3 className="text-xl font-bold text-gray-900">
          Reviews ({reviews?.length || 0})
        </h3>

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => {
              const reviewerName = review.user?.name || 
                `${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim() || 
                "Anonymous Musician";

              return (
                <div key={review.id} className="rounded-xl border bg-white p-5 shadow-sm space-y-2">
                  {/* If user's left a review or if they're an admin, put a delete button to delete the review */}
                  {currentUser?.roleId == "role_admin" || currentUser?.id == review.userId ?  (
                    <div><DeleteReviewButton reviewId={review.id} /></div>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-800">
                      {reviewerName}
                    </span>
                    <div className="flex text-yellow-400 text-sm">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-200">{"★".repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No reviews left on this arrangement yet.
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Checks to see if they're signed in */}
        {!currentUser ? (
          <div className="rounded-xl border bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-600">
              You must be signed in to leave a review.
            </p>
          </div>
        ) : hasUserReviewed ? (
          // If user's left a review, leave a message telling them thanks and don't let them
          // submit another one
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-sm font-medium text-green-900">
              Thank for leaving a review!
            </p>
          </div>
        ) : (
          // Reviews component
          <ReviewForm sheetMusicId={sheetMusicId} />
        )}
      </div>

    </div>
  );
}