"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "@/components/courses/enroll-button";
import { CourseResourcesDialog } from "@/components/courses/course-resources-dialog";
import {
  Play,
  Award,
  CheckCircle,
  Download,
  Flame,
} from "lucide-react";

const FULL_PRICE = 1997;
const GRADUATE_PRICE = 997;
const FLASH_SALE_DURATION_HOURS = 48;

interface CoursePriceCardProps {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  isFree: boolean;
  price: number | null;
  certificateType: string;
  isEnrolled: boolean;
  enrollmentStatus: string | null;
  nextLessonId: string | null;
  miniDiplomaCompletedAt: string | null;
}

function getTimeRemaining(completedAt: string | null) {
  if (!completedAt) return null;

  const completedDate = new Date(completedAt);
  const expiryTime = new Date(completedDate.getTime() + FLASH_SALE_DURATION_HOURS * 60 * 60 * 1000);
  const now = new Date();
  const diff = expiryTime.getTime() - now.getTime();

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
}

export function CoursePriceCard({
  courseId,
  courseTitle,
  courseSlug,
  isFree,
  price,
  certificateType,
  isEnrolled,
  enrollmentStatus,
  nextLessonId,
  miniDiplomaCompletedAt,
}: CoursePriceCardProps) {
  const [countdown, setCountdown] = useState(getTimeRemaining(miniDiplomaCompletedAt));

  useEffect(() => {
    if (!miniDiplomaCompletedAt) return;

    const timer = setInterval(() => {
      setCountdown(getTimeRemaining(miniDiplomaCompletedAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [miniDiplomaCompletedAt]);

  const hasGraduateDiscount = countdown && !countdown.expired;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      {!isEnrolled && (
        <div className="text-center mb-5">
          {isFree ? (
            <>
              <p className="text-4xl font-bold text-green-600">Free</p>
              <p className="text-sm text-gray-500 mt-1">No credit card required</p>
            </>
          ) : hasGraduateDiscount ? (
            <div className="space-y-3">
              {/* Graduate Flash Sale Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-bold">
                  <Flame className="w-4 h-4" />
                  <span>GRADUATE FLASH SALE</span>
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  Before we close the spot!
                </div>
              </div>
              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-500">Ends in:</span>
                <span className="font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded">
                  {String(countdown?.hours || 0).padStart(2, '0')}:
                  {String(countdown?.minutes || 0).padStart(2, '0')}:
                  {String(countdown?.seconds || 0).padStart(2, '0')}
                </span>
              </div>
              {/* Price Display */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl text-gray-400 line-through">${FULL_PRICE.toLocaleString()}</span>
                <span className="text-4xl font-bold text-green-600">${GRADUATE_PRICE.toLocaleString()}</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Save $1,000!</Badge>
              <p className="text-sm text-gray-500">Lifetime access</p>
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold text-gray-900">
                ${price ? price.toLocaleString() : FULL_PRICE.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Lifetime access</p>
            </>
          )}
        </div>
      )}

      {isEnrolled ? (
        <div className="space-y-3">
          {nextLessonId && enrollmentStatus !== "COMPLETED" && (
            <Link href={`/learning/${courseSlug}/${nextLessonId}`}>
              <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 h-12 text-base" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
            </Link>
          )}
          {enrollmentStatus === "COMPLETED" && (
            <Link href="/my-credentials">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base" size="lg">
                <Award className="w-5 h-5 mr-2" />
                View Certificate
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <EnrollButton courseId={courseId} courseName={courseTitle} />
        </div>
      )}

      {isEnrolled && certificateType !== "MINI_DIPLOMA" && (
        <CourseResourcesDialog
          courseId={courseId}
          courseName={courseTitle}
          trigger={
            <Button variant="outline" className="w-full mt-3 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              <Download className="w-4 h-4 mr-2" />
              Course Resources
            </Button>
          }
        />
      )}

      {!isEnrolled && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Certificate included
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              1:1 coach support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Lifetime access
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
