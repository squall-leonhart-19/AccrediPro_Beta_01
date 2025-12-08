import type {
  User,
  Course,
  Module,
  Lesson,
  Enrollment,
  Certificate,
  Message,
  Notification,
  CommunityPost,
  LessonProgress,
} from "@prisma/client";

// Extended types with relations
export type CourseWithModules = Course & {
  modules: (Module & {
    lessons: Lesson[];
  })[];
  category?: { name: string; slug: string } | null;
  _count?: {
    enrollments: number;
  };
};

export type EnrollmentWithCourse = Enrollment & {
  course: Course & {
    modules: (Module & {
      lessons: Lesson[];
    })[];
  };
};

export type LessonWithProgress = Lesson & {
  progress?: LessonProgress | null;
  module: Module;
};

export type UserProfile = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "avatar" | "bio" | "role" | "createdAt"
>;

export type MessageWithUsers = Message & {
  sender: UserProfile;
  receiver: UserProfile;
};

export type CommunityPostWithAuthor = CommunityPost & {
  author: UserProfile;
  _count?: {
    comments: number;
  };
};

export type CertificateWithCourse = Certificate & {
  course: Course;
  user: UserProfile;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Webhook types
export interface WebhookPayload {
  eventType: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// Progress tracking
export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lastAccessedAt?: Date;
}

// Dashboard stats
export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  totalWatchTime: number;
  currentStreak: number;
}

// Admin stats
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
  recentSignups: number;
  activeUsers: number;
}
