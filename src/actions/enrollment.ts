'use server';

import { revalidatePath } from 'next/cache';
import { Enrollment, Course, User, Progress, Video, Chapter } from '@/models';
import { auth } from '@/lib/auth';

export async function checkEnrollment(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, enrolled: false };
    }

    const enrollment = await Enrollment.findOne({
      where: {
        userId: session.user.id,
        courseId,
        status: 'active',
      },
    });

    return {
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment ? enrollment.toJSON() : null,
    };
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return { success: false, error: 'Failed to check enrollment' };
  }
}

export async function createEnrollment(courseId: string, paymentId: string, amountPaid: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const existingEnrollment = await Enrollment.findOne({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    if (existingEnrollment) {
      return { success: false, error: 'Already enrolled in this course' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    const enrollment = await Enrollment.create({
      userId: session.user.id,
      courseId,
      paymentId,
      amountPaid,
      status: 'active',
      enrolledAt: new Date(),
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/dashboard');

    return { success: true, enrollment: enrollment.toJSON() };
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return { success: false, error: 'Failed to create enrollment' };
  }
}

export async function getUserEnrollments() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const enrollments = await Enrollment.findAll({
      where: {
        userId: session.user.id,
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['name', 'image'],
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
        },
      ],
      order: [['enrolledAt', 'DESC']],
    });

    return { success: true, enrollments: enrollments.map((e) => e.toJSON()) };
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return { success: false, error: 'Failed to fetch enrollments' };
  }
}

export async function completeEnrollment(enrollmentId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) {
      return { success: false, error: 'Enrollment not found' };
    }

    if (enrollment.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    await enrollment.update({
      status: 'completed',
      completedAt: new Date(),
    });

    revalidatePath('/dashboard');
    return { success: true, enrollment: enrollment.toJSON() };
  } catch (error) {
    console.error('Error completing enrollment:', error);
    return { success: false, error: 'Failed to complete enrollment' };
  }
}

export async function getEnrollmentStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const enrollments = await Enrollment.findAll({
      where: { userId: session.user.id },
    });

    const stats = {
      enrolledCourses: enrollments.length,
      completedCourses: enrollments.filter((e) => e.status === 'completed').length,
      inProgressCourses: enrollments.filter((e) => e.status === 'active').length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
