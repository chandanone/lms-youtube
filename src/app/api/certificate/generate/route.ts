import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Certificate, Course, User } from '@/models';
import { generateCertificatePDF } from '@/lib/pdf-generator';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get('certificateId');

    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 });
    }

    const certificate = await Certificate.findByPk(certificateId, {
      include: [
        {
          model: User,
          as: 'user',
        },
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

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (certificate.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = certificate.get('user') as any;
    const course = certificate.get('course') as any;
    const instructor = course.get('instructor') as any;

    const pdfBuffer = await generateCertificatePDF({
      userName: user.name || user.email,
      courseName: course.title,
      certificateNumber: certificate.certificateNumber,
      completionDate: certificate.issuedAt,
      instructorName: instructor?.name,
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
