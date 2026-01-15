import { auth } from '@/lib/auth';
import { getCourseById } from '@/actions/course';
import { checkEnrollment } from '@/actions/enrollment';
import { getCourseProgress } from '@/actions/progress';
import { redirect } from 'next/navigation';
import VideoPlayer from '@/components/course/VideoPlayer';
import ChapterList from '@/components/course/ChapterList';
import QuizContainer from '@/components/quiz/QuizContainer';
import ProgressTracker from '@/components/course/ProgressTracker';
import CourseEnrollButton from '@/components/course/CourseEnrollButton';

interface LearnPageProps {
  params: { courseId: string };
  searchParams: { v?: string; quiz?: string };
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect(`/?callbackUrl=/courses/${params.courseId}/learn`);
  }

  const courseResult = await getCourseById(params.courseId);
  
  if (!courseResult.success || !courseResult.course) {
    redirect('/courses');
  }

  const course = courseResult.course;
  const enrollmentResult = await checkEnrollment(params.courseId);
  const isEnrolled = enrollmentResult.enrolled;

  const progressResult = await getCourseProgress(params.courseId);
  const courseProgress = progressResult.success ? progressResult.progress : null;

  const allVideos: any[] = [];
  const chapters = course.chapters || [];
  
  chapters.forEach((chapter: any) => {
    if (chapter.videos) {
      allVideos.push(
        ...chapter.videos.map((v: any) => ({
          ...v,
          chapterTitle: chapter.title,
          chapterId: chapter.id,
        }))
      );
    }
  });

  allVideos.sort((a, b) => {
    const chapterA = chapters.find((c: any) => c.id === a.chapterId);
    const chapterB = chapters.find((c: any) => c.id === b.chapterId);
    if (chapterA.order !== chapterB.order) return chapterA.order - chapterB.order;
    return a.order - b.order;
  });

  const freeVideosCount = 3;
  allVideos.forEach((video, index) => {
    video.isFree = index < freeVideosCount;
  });

  const currentVideoId = searchParams.v || allVideos[0]?.id;
  const currentVideo = allVideos.find((v) => v.id === currentVideoId);
  
  const showQuiz = searchParams.quiz;
  const currentChapter = chapters.find((c: any) => c.id === currentVideo?.chapterId);

  const canAccessVideo = isEnrolled || currentVideo?.isFree;

  if (!canAccessVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Enrollment Required</h1>
            <p className="text-gray-600 mb-6">
              You've watched the first {freeVideosCount} free videos. Enroll now to continue learning!
            </p>
            <CourseEnrollButton 
              courseId={params.courseId} 
              courseName={course.title}
              price={course.price}
              currency={course.currency}
              isEnrolled={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          {courseProgress && (
            <ProgressTracker 
              completed={courseProgress.completedVideos}
              total={courseProgress.totalVideos}
              percentage={courseProgress.percentage}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showQuiz && currentChapter ? (
              <QuizContainer 
                chapterId={currentChapter.id}
                courseId={params.courseId}
                onComplete={() => {
                  window.location.href = `/courses/${params.courseId}/learn?v=${currentVideoId}`;
                }}
              />
            ) : (
              <div className="space-y-4">
                <VideoPlayer 
                  video={currentVideo}
                  courseId={params.courseId}
                  isEnrolled={isEnrolled}
                />
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentVideo?.title}</h2>
                  <p className="text-gray-600 mb-4">Chapter: {currentVideo?.chapterTitle}</p>
                  
                  {currentChapter?.quiz && isEnrolled && (
                    <a
                      href={`/courses/${params.courseId}/learn?v=${currentVideoId}&quiz=true`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Take Knowledge Check
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <ChapterList 
              chapters={chapters}
              currentVideoId={currentVideoId}
              courseId={params.courseId}
              isEnrolled={isEnrolled}
              freeVideosCount={freeVideosCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
