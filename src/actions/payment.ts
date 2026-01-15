'use server';

import { razorpay, verifyPaymentSignature } from '@/lib/razorpay';
import { Course } from '@/models';
import { auth } from '@/lib/auth';
import { createEnrollment } from './enrollment';

export async function createRazorpayOrder(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return { success: false, error: 'Course not found' };
    }

    if (!course.published) {
      return { success: false, error: 'Course is not available for purchase' };
    }

    const amount = Math.round(course.price * 100);
    const currency = course.currency;

    const options = {
      amount,
      currency,
      receipt: `rcpt_${courseId}_${session.user.id}_${Date.now()}`,
      notes: {
        courseId,
        userId: session.user.id,
        courseName: course.title,
      },
    };

    const order = await razorpay.orders.create(options);

    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: 'Failed to create payment order' };
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  courseId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return { success: false, error: 'Invalid payment signature' };
    }

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return { success: false, error: 'Payment not completed' };
    }

    const amountPaid = payment.amount / 100;

    const enrollmentResult = await createEnrollment(courseId, paymentId, amountPaid);

    if (!enrollmentResult.success) {
      return { success: false, error: enrollmentResult.error };
    }

    return {
      success: true,
      enrollment: enrollmentResult.enrollment,
      payment: {
        id: paymentId,
        amount: amountPaid,
        status: payment.status,
      },
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}

export async function getPaymentDetails(paymentId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const payment = await razorpay.payments.fetch(paymentId);

    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        createdAt: new Date(payment.created_at * 1000),
      },
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { success: false, error: 'Failed to fetch payment details' };
  }
}

export async function initiateRefund(paymentId: string, amount?: number) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const refundAmount = amount ? Math.round(amount * 100) : undefined;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: refundAmount,
    });

    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    };
  } catch (error) {
    console.error('Error initiating refund:', error);
    return { success: false, error: 'Failed to initiate refund' };
  }
}
