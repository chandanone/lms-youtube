import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface CertificateData {
  userName: string;
  courseName: string;
  certificateNumber: string;
  completionDate: Date;
  instructorName?: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(3).stroke('#2563eb');
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80).lineWidth(1).stroke('#93c5fd');

      doc
        .fontSize(50)
        .font('Helvetica-Bold')
        .fillColor('#1e3a8a')
        .text('Certificate of Completion', 0, 100, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('This is to certify that', 0, 180, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .fontSize(36)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(data.userName, 0, 220, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('has successfully completed the course', 0, 280, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .fillColor('#2563eb')
        .text(data.courseName, 0, 320, {
          align: 'center',
          width: pageWidth,
        });

      const formattedDate = data.completionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(`Completed on ${formattedDate}`, 0, 390, {
          align: 'center',
          width: pageWidth,
        });

      doc
        .fontSize(10)
        .fillColor('#94a3b8')
        .text(`Certificate No: ${data.certificateNumber}`, 0, 420, {
          align: 'center',
          width: pageWidth,
        });

      const signatureY = pageHeight - 120;
      const leftX = 150;
      const rightX = pageWidth - 250;

      doc
        .moveTo(leftX, signatureY)
        .lineTo(leftX + 150, signatureY)
        .stroke('#94a3b8');

      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(process.env.CERTIFICATE_ISSUER_NAME || 'LearnHub Academy', leftX, signatureY + 10, {
          width: 150,
          align: 'center',
        });

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('Platform Director', leftX, signatureY + 30, {
          width: 150,
          align: 'center',
        });

      if (data.instructorName) {
        doc
          .moveTo(rightX, signatureY)
          .lineTo(rightX + 150, signatureY)
          .stroke('#94a3b8');

        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(data.instructorName, rightX, signatureY + 10, {
            width: 150,
            align: 'center',
          });

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#64748b')
          .text('Course Instructor', rightX, signatureY + 30, {
            width: 150,
            align: 'center',
          });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
