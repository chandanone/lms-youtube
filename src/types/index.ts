export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  currency: string;
  instructorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  chapterId: string;
  title: string;
  youtubeId: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: Date;
  completedAt: Date | null;
  paymentId: string | null;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  videoId: string;
  courseId: string;
  completed: boolean;
  watchTime: number;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: 'mcq' | 'flipcard';
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  enrollmentId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CourseProgress {
  totalVideos: number;
  completedVideos: number;
  percentage: number;
}

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificatesEarned: number;
}
