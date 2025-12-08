"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  isVerified: boolean;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  };
}

interface CourseReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  totalEnrolled: number;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-6 h-6" : "w-4 h-4";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses} ${
            star <= rating
              ? "fill-gold-400 text-gold-400"
              : star - 0.5 <= rating
              ? "fill-gold-400/50 text-gold-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const ratings = [5, 4, 3, 2, 1];
  const total = reviews.length;

  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const count = reviews.filter((r) => r.rating === rating).length;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-gray-600">{rating}</span>
            <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-12 text-gray-500 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CourseReviews({
  reviews,
  averageRating,
  totalReviews,
  totalEnrolled,
}: CourseReviewsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Reviews</h2>
        <p className="text-gray-600">
          See what {totalEnrolled.toLocaleString()}+ practitioners say about this course
        </p>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-3 gap-8 mb-10 p-6 bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-100">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
            <span className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-lg">/ 5</span>
          </div>
          <StarRating rating={averageRating} size="lg" />
          <p className="text-gray-600 mt-2">
            Based on {totalReviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2">
          <RatingBreakdown reviews={reviews} />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center text-white font-semibold text-lg">
                  {review.user.firstName?.[0] || "A"}
                  {review.user.lastName?.[0] || ""}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    {review.isVerified && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Quote className="w-8 h-8 text-gold-200" />
            </div>

            {review.title && (
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            )}
            <p className="text-gray-600 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
