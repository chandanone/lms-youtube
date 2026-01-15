'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createRazorpayOrder, verifyPayment } from '@/actions/payment';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

interface CourseEnrollButtonProps {
  courseId: string;
  courseName: string;
  price: number;
  currency: string;
  isEnrolled: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseEnrollButton({ 
  courseId, 
  courseName, 
  price, 
  currency, 
  isEnrolled 
}: CourseEnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        return;
      }

      const orderResult = await createRazorpayOrder(courseId);
      
      if (!orderResult.success || !orderResult.order) {
        alert(orderResult.error || 'Failed to create order');
        return;
      }

      const options = {
        key: orderResult.order.key,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: 'LearnHub LMS',
        description: courseName,
        order_id: orderResult.order.id,
        handler: async function (response: any) {
          const verifyResult = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            courseId
          );

          if (verifyResult.success) {
            alert('Payment successful! You are now enrolled in the course.');
            router.refresh();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button disabled className="w-full bg-green-600">
        ✓ Enrolled
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? 'Processing...' : `Enroll Now - ${formatCurrency(price, currency)}`}
    </Button>
  );
}
