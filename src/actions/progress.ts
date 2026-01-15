'use server';

import { revalidatePath } from 'next/cache';
import { Progress, Video, Course, Chapter, Enrollment } from '@/models';
import { auth } from '@/lib/auth';
import { completeEnrollment } from './enrollment';

export async function updateProgress(videoId: string, data: { completed?: boolean; watchTime?: number }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const video = await Video.findByPk(videoId, {
      include: [
        {
          model: Chapter,
          as: 'chapter',
          include: [
            {
              model: Course,
              as: 'course',
            },
          ],
        },
      ],
    });

    if (!video) {
      return { success: false, error: 'Video not found' };
    }

    const chapter = video.get('chapter') as any;
    const course = chapter.get('course') as any;

    const enrollment = await Enrollment.findOne({
      where: {
        userId: session.user.id,
        courseId: course.id,
        status: 'active',
      },
    });

    if (!enrollment && !video.isFree) {
      return { success: false, error: 'Not enrolled in this course' };
    }

    const [progress, created] = await Progress.findOrCreate({
      where: {
        userId: session.user.id,
        videoId,
      },
      defaults: {
        courseId: course.id,
        completed: data.completed || false,
        watchTime: data.watchTime || 0,
        lastWatchedAt: new Date(),
      },
    });

    if (!created) {
      await progress.update({
        completed: data.completed !== undefined ? data.completed : progress.completed,
        watchTime: data.watchTime !== undefined ? data.watchTime : progress.watchTime,
        lastWatchedAt: new Date(),
      });
    }

    if (data.completed && enrollment) {
      const courseProgress = await getCourseProgress(course.id);
      if (courseProgress.success && courseProgress.progress?.percentage === 100) {
        await completeEnrollment(enrollment.id);
      }
    }

    revalidatePath(`/courses/${course.id}/learn`);
    return { success: true, progress: progress.toJSON() };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function getCourseProgress(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Chapter,
          as: 'chapters',
          include: [
            {
              model: Video,
              as: 'videos',
            },
          ],
        },
      ],
    });

    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    const chapters = course.get('chapters') as any[];
    const allVideos: any[] = [];
    chapters.forEach((chapter) => {
      const videos = chapter.get('videos') as any[];
      allVideos.push(...videos);
    });

    const totalVideos = allVideos.length;

    const completedProgress = await Progress.findAll({
      where: {
        userId: session.user.id,
        courseId,
        completed: true,
      },
    });

    const completedVideos = completedProgress.length;
    const percentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    return {
      success: true,
      progress: {
        totalVideos,
        completedVideos,
        percentage,
      },
    };
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return { success: false, error: 'Failed to fetch progress' };
  }
}

export async function getVideoProgress(videoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, progress: null };
    }

    const progress = await Progress.findOne({
      where: {
        userId: session.user.id,
        videoId,
      },
    });

    return {
      success: true,
      progress: progress ? progress.toJSON() : null,
    };
  } catch (error) {
    console.error('Error fetching video progress:', error);
    return { success: false, error: 'Failed to fetch video progress' };
  }
}

export async function getUserProgress() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const progress = await Progress.findAll({
      where: {
        userId: session.user.id,
      },
      include: [
        {
          model: Video,
          as: 'video',
          include: [
            {
              model: Chapter,
              as: 'chapter',
              include: [
                {
                  model: Course,
                  as: 'course',
                },
              ],
            },
          ],
        },
      ],
      order: [['lastWatchedAt', 'DESC']],
    });

    return { success: true, progress: progress.map((p) => p.toJSON()) };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { success: false, error: 'Failed to fetch progress' };
  }
}
