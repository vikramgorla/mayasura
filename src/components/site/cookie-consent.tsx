'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export function CookieConsent({ accentColor = '#6366F1', bgColor = '#FFFFFF', textColor = '#000000' }: {
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mayasura-cookie-consent');
    if (!consent) {
      // Show after 2 seconds
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('mayasura-cookie-consent', 'accepted');
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem('mayasura-cookie-consent', 'dismissed');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div
            className="max-w-xl mx-auto rounded-xl shadow-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{
              backgroundColor: bgColor,
              borderColor: `${textColor}10`,
              color: textColor,
            }}
          >
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: `${textColor}40` }} />
              <p className="text-sm leading-relaxed" style={{ color: `${textColor}70` }}>
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={accept}
                className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Accept
              </button>
              <button
                onClick={dismiss}
                className="p-2 rounded-lg transition-colors"
                style={{ color: `${textColor}40` }}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
