"use client";

import { useState } from "react";
import { Star, Quote, ChevronRight, CheckCircle2, ThumbsUp, Award, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

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
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
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
    <div className="space-y-3">
      {ratings.map((rating) => {
        const count = reviews.filter((r) => r.rating === rating).length;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={rating} className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 w-16">
              <span className="font-medium text-gray-700">{rating}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-10 text-gray-500 text-right font-medium">{percentage.toFixed(0)}%</span>
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
  const [visibleCount, setVisibleCount] = useState(8);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const displayedReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, reviews.length));
  };

  const toggleExpanded = (id: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate recommendation percentage (4+ stars)
  const recommendationPercentage = reviews.length > 0
    ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)
    : 0;

  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-100 rounded-xl">
            <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
        </div>
        <p className="text-gray-600">
          See what {totalEnrolled.toLocaleString()}+ practitioners say about this certification
        </p>
      </div>

      {/* Rating Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Left: Overall Rating */}
          <div className="md:col-span-4 p-8 bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className="text-6xl font-bold tracking-tight">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-2xl text-white/70">/ 5</span>
              </div>
              <div className="flex justify-center mb-3">
                <StarRating rating={averageRating} size="lg" />
              </div>
              <p className="text-white/80 text-sm">
                Based on {totalReviews.toLocaleString()} reviews
              </p>

              {/* Stats Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {recommendationPercentage}% recommend
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                  <Award className="w-3.5 h-3.5" />
                  Top Rated
                </div>
              </div>
            </div>
          </div>

          {/* Right: Breakdown */}
          <div className="md:col-span-8 p-8">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-burgundy-600" />
              <h3 className="font-semibold text-gray-900">Rating Breakdown</h3>
            </div>
            <RatingBreakdown reviews={reviews} />
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {displayedReviews.map((review, index) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.content.length > 200;

          return (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-burgundy-100 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-burgundy-50 group-hover:ring-burgundy-100 transition-all"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {review.user.firstName?.[0] || "A"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.user.firstName} {review.user.lastName?.[0]}.
                      </span>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {differenceInDays(new Date(), new Date(review.createdAt)) <= 7
                    ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                    : format(new Date(review.createdAt), "MMM d, yyyy")}
                </span>
              </div>

              {/* Title */}
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{review.title}</h4>
              )}

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {shouldTruncate && !isExpanded
                  ? `${review.content.slice(0, 200)}...`
                  : review.content}
              </p>

              {shouldTruncate && (
                <button
                  onClick={() => toggleExpanded(review.id)}
                  className="text-burgundy-600 text-xs font-medium mt-2 hover:text-burgundy-700 transition-colors"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-burgundy-600 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful
                </button>
                <Quote className="w-5 h-5 text-gray-100 group-hover:text-burgundy-100 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3 mt-10">
          <p className="text-sm text-gray-500">
            Showing {visibleCount} of {reviews.length} reviews
          </p>
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy-600 text-white hover:bg-burgundy-700 transition-all text-sm font-medium shadow-sm"
          >
            Load More Reviews
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
