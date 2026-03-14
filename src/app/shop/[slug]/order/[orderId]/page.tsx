'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '../../layout';

export default function OrderConfirmationPage() {
  const shop = useShop();
  const params = useParams();
  const orderId = params.orderId as string;

  if (!shop) return null;
  const { brand, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: templateId === 'bold' ? 700 : templateId === 'minimal' ? 400 : 600,
    letterSpacing: templateId === 'bold' ? '-0.04em' : '-0.02em',
    textTransform: (templateId === 'bold' ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const borderRadius = templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : templateId === 'bold' ? '0' : '0';

  return (
    <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-2xl'} mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center`}>
      <div
        className="p-10 sm:p-16"
        style={{
          backgroundColor: isDark ? '#111111' : `${accentColor}06`,
          borderRadius,
          border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
          boxShadow: templateId === 'classic' ? '8px 8px 16px rgba(0,0,0,0.04), -8px -8px 16px rgba(255,255,255,0.7)' : undefined,
        }}
      >
        <div className="text-5xl mb-6">
          {templateId === 'playful' ? '🎉' : templateId === 'bold' ? '✓' : '✦'}
        </div>
        <h1 className="text-2xl sm:text-3xl mb-4" style={headingStyle}>
          {templateId === 'playful' ? 'Order Confirmed! 🎊' : templateId === 'bold' ? 'ORDER CONFIRMED' : 'Order Confirmed'}
        </h1>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: `${textColor}50` }}>
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>

        <div
          className="p-4 mb-8 inline-block"
          style={{
            backgroundColor: `${textColor}06`,
            borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
            border: templateId === 'bold' ? `1px solid ${textColor}15` : undefined,
          }}
        >
          <p className="text-xs mb-1" style={{ color: `${textColor}40` }}>
            {templateId === 'bold' ? 'ORDER ID' : 'Order ID'}
          </p>
          <p className="font-mono font-medium text-sm">{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/shop/${slug}`}
            className="t-btn-primary px-8 py-3"
            style={{
              backgroundColor: isDark ? accentColor : textColor,
              color: isDark ? '#FFFFFF' : bgColor,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
            }}
          >
            {templateId === 'bold' ? 'CONTINUE SHOPPING' : templateId === 'playful' ? 'Continue Shopping ✨' : 'Continue Shopping'}
          </Link>
          <Link
            href={`/site/${slug}`}
            className="t-btn-secondary px-8 py-3 border"
            style={{
              borderColor: `${textColor}15`,
              color: textColor,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
              borderWidth: templateId === 'bold' ? '2px' : '1px',
            }}
          >
            {templateId === 'bold' ? 'BACK TO WEBSITE' : 'Back to Website'}
          </Link>
        </div>
      </div>
    </div>
  );
}
