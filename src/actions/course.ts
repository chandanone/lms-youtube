'use server';

import { revalidatePath } from 'next/cache';
import { Course, Chapter, Video, User, Testimonial } from '@/models';
import { auth } from '@/lib/auth';

export async function getAllCourses(published: boolean = true) {
  try {
    const courses = await Course.findAll({
      where: published ? { published: true } : {},
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email', 'image'],
        },
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
      order: [['createdAt', 'DESC']],
    });

    return { success: true, courses: courses.map((c) => c.toJSON()) };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: 'Failed to fetch courses' };
  }
}

export async function getCourseById(courseId: string) {
  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email', 'image'],
        },
        {
          model: Chapter,
          as: 'chapters',
          include: [
            {
              model: Video,
              as: 'videos',
              order: [['order', 'ASC']],
            },
          ],
          order: [['order', 'ASC']],
        },
        {
          model: Testimonial,
          as: 'testimonials',
          where: { approved: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'image'],
            },
          ],
        },
      ],
    });

    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    return { success: true, course: course.toJSON() };
  } catch (error) {
    console.error('Error fetching course:', error);
    return { success: false, error: 'Failed to fetch course' };
  }
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.create({
      ...data,
      instructorId: session.user.id,
      currency: 'INR',
      published: false,
    });

    revalidatePath('/admin/courses');
    return { success: true, course: course.toJSON() };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error: 'Failed to create course' };
  }
}

export async function updateCourse(
  courseId: string,
  data: Partial<{
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    published: boolean;
  }>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    await course.update(data);
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/admin/courses');

    return { success: true, course: course.toJSON() };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Failed to update course' };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    await course.destroy();
    revalidatePath('/admin/courses');
    revalidatePath('/courses');

    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}

export async function createChapter(courseId: string, data: { title: string; description?: string; order: number }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const chapter = await Chapter.create({
      courseId,
      ...data,
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { success: true, chapter: chapter.toJSON() };
  } catch (error) {
    console.error('Error creating chapter:', error);
    return { success: false, error: 'Failed to create chapter' };
  }
}

export async function createVideo(
  chapterId: string,
  data: { title: string; youtubeId: string; duration: number; order: number; isFree?: boolean }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const chapter = await Chapter.findByPk(chapterId, {
      include: [{ model: Course, as: 'course' }],
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found' };
    }

    const course = chapter.get('course') as any;
    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const video = await Video.create({
      chapterId,
      ...data,
    });

    revalidatePath(`/admin/courses/${course.id}/edit`);
    return { success: true, video: video.toJSON() };
  } catch (error) {
    console.error('Error creating video:', error);
    return { success: false, error: 'Failed to create video' };
  }
}
