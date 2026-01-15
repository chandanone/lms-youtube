import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createEnrollment } from '@/actions/enrollment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    console.log('Webhook event received:', event.event);

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const notes = payment.notes || {};
        
        console.log('Payment captured:', {
          paymentId: payment.id,
          amount: payment.amount / 100,
          courseId: notes.courseId,
          userId: notes.userId,
        });

        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        console.log('Payment failed:', {
          paymentId: payment.id,
          errorCode: payment.error_code,
          errorDescription: payment.error_description,
        });
        break;
      }

      case 'order.paid': {
        const order = event.payload.order.entity;
        console.log('Order paid:', {
          orderId: order.id,
          amount: order.amount / 100,
        });
        break;
      }

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
