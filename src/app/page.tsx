import { auth } from "@/lib/auth";
import { getAllCourses } from "@/actions/course";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getYouTubeThumbnail } from "@/lib/utils";
import Image from "next/image";

async function handleSignIn() {
  "use server";
  await signIn("google");
}

export default async function HomePage() {
  const session = await auth();
  const coursesResult = await getAllCourses(true);
  const courses = coursesResult.success ? coursesResult.courses : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">LearnHub LMS</h1>
              <p className="text-sm text-gray-600">Master New Skills Online</p>
            </div>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <a
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/courses"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    My Courses
                  </a>
                  {session.user.role === "admin" && (
                    <a
                      href="/admin/courses"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Admin
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {session.user.name}
                    </span>
                  </div>
                </>
              ) : (
                <form action={handleSignIn}>
                  <Button type="submit" size="lg">
                    Sign In with Google
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn from the Best Instructors
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access thousands of courses in web development, design, business,
            and more. Watch the first 3 videos free, then enroll for full
            access.
          </p>
          {!session?.user && (
            <form action={handleSignIn}>
              <Button type="submit" size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Video-Based Learning
              </h3>
              <p className="text-gray-600">
                Watch high-quality video courses at your own pace
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Interactive Quizzes
              </h3>
              <p className="text-gray-600">
                Test your knowledge with gamified assessments
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Certificates</h3>
              <p className="text-gray-600">
                Get certified upon course completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Start learning today with our top-rated courses
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No courses available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => {
                const firstVideo = course.chapters?.[0]?.videos?.[0];
                const thumbnail = firstVideo
                  ? getYouTubeThumbnail(firstVideo.youtubeId)
                  : course.thumbnail || "/placeholder-course.jpg";

                const totalVideos =
                  course.chapters?.reduce(
                    (acc: number, ch: any) => acc + (ch.videos?.length || 0),
                    0
                  ) || 0;

                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-600">
                        First 3 Free
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{course.chapters?.length || 0} Chapters</span>
                        <span>{totalVideos} Videos</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {course.instructor?.image && (
                          <Image
                            src={course.instructor.image}
                            alt={course.instructor.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-600">
                          {course.instructor?.name || "Instructor"}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(course.price, course.currency)}
                      </span>
                      <a href={`/courses/${course.id}`}>
                        <Button>View Course</Button>
                      </a>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning on LearnHub. Watch the
            first 3 videos of any course completely free!
          </p>
          {!session?.user ? (
            <form action={handleSignIn}>
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Sign Up Now - It's Free
              </Button>
            </form>
          ) : (
            <a href="/courses">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Browse All Courses
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LearnHub LMS</h3>
              <p className="text-gray-400">
                Professional online learning platform with interactive courses
                and certifications.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/courses" className="hover:text-white">
                    Browse Courses
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="hover:text-white">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/profile" className="hover:text-white">
                    Profile
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LearnHub LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
