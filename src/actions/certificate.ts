'use server';

import { Certificate, Enrollment, Course, User } from '@/models';
import { auth } from '@/lib/auth';
import { generateCertificateNumber } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function checkCertificateEligibility(courseId: string) {
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
      return { success: false, eligible: false, reason: 'Course not completed' };
    }

    const existingCertificate = await Certificate.findOne({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    if (existingCertificate) {
      return {
        success: true,
        eligible: true,
        certificate: existingCertificate.toJSON(),
        alreadyIssued: true,
      };
    }

    return { success: true, eligible: true, alreadyIssued: false };
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return { success: false, error: 'Failed to check eligibility' };
  }
}

export async function generateCertificate(courseId: string) {
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
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
            },
          ],
        },
      ],
    });

    if (!enrollment) {
      return { success: false, error: 'Course not completed' };
    }

    const existingCertificate = await Certificate.findOne({
      where: {
        userId: session.user.id,
        courseId,
      },
    });

    if (existingCertificate) {
      return {
        success: true,
        certificate: existingCertificate.toJSON(),
        message: 'Certificate already generated',
      };
    }

    const certificateNumber = generateCertificateNumber();

    const certificate = await Certificate.create({
      userId: session.user.id,
      enrollmentId: enrollment.id,
      courseId,
      certificateNumber,
      issuedAt: new Date(),
    });

    revalidatePath('/dashboard');
    revalidatePath(`/courses/${courseId}`);

    return { success: true, certificate: certificate.toJSON() };
  } catch (error) {
    console.error('Error generating certificate:', error);
    return { success: false, error: 'Failed to generate certificate' };
  }
}

export async function getUserCertificates() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const certificates = await Certificate.findAll({
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
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [['issuedAt', 'DESC']],
    });

    return { success: true, certificates: certificates.map((c) => c.toJSON()) };
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return { success: false, error: 'Failed to fetch certificates' };
  }
}

export async function getCertificateByNumber(certificateNumber: string) {
  try {
    const certificate = await Certificate.findOne({
      where: { certificateNumber },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!certificate) {
      return { success: false, error: 'Certificate not found' };
    }

    return { success: true, certificate: certificate.toJSON() };
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return { success: false, error: 'Failed to fetch certificate' };
  }
}

export async function verifyCertificate(certificateNumber: string) {
  try {
    const certificate = await Certificate.findOne({
      where: { certificateNumber },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Course,
          as: 'course',
          attributes: ['title'],
        },
      ],
    });

    if (!certificate) {
      return { success: false, valid: false, message: 'Certificate not found' };
    }

    return {
      success: true,
      valid: true,
      certificate: {
        userName: (certificate.get('user') as any).name,
        courseName: (certificate.get('course') as any).title,
        issuedAt: certificate.issuedAt,
      },
    };
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return { success: false, error: 'Failed to verify certificate' };
  }
}
