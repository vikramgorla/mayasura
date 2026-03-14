'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '../../layout';

interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  items: string;
  total: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function OrderConfirmationPage() {
  const shop = useShop();
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderData | null>(null);

  if (!shop) return null;
  const { brand } = shop;
  const slug = brand.slug || brand.id;

  // For now, we show a simple confirmation since we have the order ID
  // In a full implementation, we'd fetch the order from an API

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div
        className="rounded-3xl p-10 sm:p-16"
        style={{ backgroundColor: `${brand.accent_color}08` }}
      >
        <div className="text-6xl mb-6">🎉</div>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-4"
          style={{ fontFamily: brand.font_heading }}
        >
          Order Confirmed!
        </h1>
        <p className="text-lg opacity-60 mb-8">
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>

        <div
          className="rounded-xl p-4 mb-8 inline-block"
          style={{ backgroundColor: `${brand.primary_color}08` }}
        >
          <p className="text-sm opacity-50 mb-1">Order ID</p>
          <p className="font-mono font-semibold">{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/shop/${slug}`}
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: brand.accent_color, color: '#fff' }}
          >
            Continue Shopping
          </Link>
          <Link
            href={`/site/${slug}`}
            className="px-8 py-3 rounded-xl text-sm font-semibold border transition-colors hover:opacity-80"
            style={{ borderColor: `${brand.primary_color}20` }}
          >
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
