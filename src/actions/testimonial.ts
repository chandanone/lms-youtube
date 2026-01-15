'use server';

import { revalidatePath } from 'next/cache';
import { Testimonial, Enrollment, User } from '@/models';
import { auth } from '@/lib/auth';

export async function createTestimonial(courseId: string, data: { rating: number; comment: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const enrollment = await Enrollment.findOne({
      where: {
        userId: session.user.id,
        courseId,
        status: 'completed',
      },
    });

    if (!enrollment) {
      return { success: false, error: 'You must complete the course before leaving a testimonial' };
    }

    const existingTestimonial = await Testimonial.findOne({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    if (existingTestimonial) {
      return { success: false, error: 'You have already submitted a testimonial for this course' };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    const testimonial = await Testimonial.create({
      userId: session.user.id,
      courseId,
      ...data,
      approved: true,
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true, testimonial: testimonial.toJSON() };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return { success: false, error: 'Failed to create testimonial' };
  }
}

export async function getCourseTestimonials(courseId: string) {
  try {
    const testimonials = await Testimonial.findAll({
      where: {
        courseId,
        approved: true,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'image'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const averageRating =
      testimonials.length > 0
        ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
        : 0;

    return {
      success: true,
      testimonials: testimonials.map((t) => t.toJSON()),
      stats: {
        count: testimonials.length,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { success: false, error: 'Failed to fetch testimonials' };
  }
}

export async function updateTestimonial(
  testimonialId: string,
  data: Partial<{ rating: number; comment: string }>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const testimonial = await Testimonial.findByPk(testimonialId);
    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    if (testimonial.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    await testimonial.update(data);
    revalidatePath(`/courses/${testimonial.courseId}`);

    return { success: true, testimonial: testimonial.toJSON() };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, error: 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(testimonialId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const testimonial = await Testimonial.findByPk(testimonialId);
    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    if (testimonial.userId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const courseId = testimonial.courseId;
    await testimonial.destroy();
    revalidatePath(`/courses/${courseId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: 'Failed to delete testimonial' };
  }
}

export async function approveTestimonial(testimonialId: string, approved: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const testimonial = await Testimonial.findByPk(testimonialId);
    if (!testimonial) {
      return { success: false, error: 'Testimonial not found' };
    }

    await testimonial.update({ approved });
    revalidatePath(`/courses/${testimonial.courseId}`);
    revalidatePath('/admin/testimonials');

    return { success: true, testimonial: testimonial.toJSON() };
  } catch (error) {
    console.error('Error approving testimonial:', error);
    return { success: false, error: 'Failed to approve testimonial' };
  }
}
