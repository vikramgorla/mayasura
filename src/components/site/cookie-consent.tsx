"use client";

import { useState, useEffect } from "react";

interface CookieConsentProps {
  accentColor: string;
  fontBody: string;
}

export function CookieConsent({ accentColor, fontBody }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mayasura-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mayasura-cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("mayasura-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 border-t shadow-lg"
      style={{
        backgroundColor: "var(--brand-surface)",
        borderColor: "var(--brand-border)",
        fontFamily: `"${fontBody}", system-ui, sans-serif`,
        color: "var(--brand-text)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm opacity-80 text-center sm:text-left">
          We use cookies to improve your experience. By continuing, you agree to
          our use of cookies.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border rounded transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--brand-border)",
              color: "var(--brand-text)",
              minHeight: "44px",
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium rounded transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: accentColor,
              color: "var(--brand-accent-text)",
              minHeight: "44px",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
