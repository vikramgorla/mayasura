"use client";

import { useState, useMemo } from "react";
import { getTemplate } from "@/lib/templates/website-templates";
import { Mail, Send } from "lucide-react";

interface ContactClientProps {
  brand: {
    name: string;
    slug: string;
    accentColor: string;
  };
  templateId: string;
}

export function ContactClient({ brand, templateId }: ContactClientProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!template) return null;

  const { typography, borderRadius } = template.preview;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/v1/public/brand/${brand.slug}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--brand-font-body)",
    fontSize: "16px", // Prevent iOS zoom
    color: "var(--brand-text)",
    backgroundColor: "var(--brand-surface)",
    borderColor: "var(--brand-border)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius,
    padding: "12px 16px",
    width: "100%",
    outline: "none",
  };

  return (
    <div
      style={{ padding: `var(--brand-section-padding, 64px) 0` }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: `${brand.accentColor}15` }}
          >
            <Mail className="h-5 w-5" style={{ color: brand.accentColor }} />
          </div>

          <h1
            style={{
              fontFamily: "var(--brand-font-heading)",
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingTracking,
              textTransform:
                typography.headingCase === "uppercase"
                  ? "uppercase"
                  : "none",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--brand-text)",
            }}
          >
            Get in Touch
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: "var(--brand-muted)",
            }}
          >
            We&apos;d love to hear from you. Send us a message.
          </p>
        </div>

        {status === "success" ? (
          <div
            className="text-center p-8 rounded-lg"
            style={{
              backgroundColor: `${brand.accentColor}10`,
              border: `1px solid ${brand.accentColor}30`,
              borderRadius,
            }}
          >
            <p className="text-3xl mb-2">✅</p>
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: "var(--brand-text)" }}
            >
              Message Sent!
            </h2>
            <p style={{ color: "var(--brand-muted)" }}>
              We&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: brand.accentColor }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--brand-text)" }}
                >
                  Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--brand-text)" }}
                >
                  Email *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--brand-text)" }}
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                style={inputStyle}
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--brand-text)" }}
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Your message..."
              />
            </div>

            {status === "error" && errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
              style={{
                fontFamily: "var(--brand-font-body)",
                fontSize: "var(--brand-button-font-size, 14px)",
                fontWeight: 500,
                backgroundColor: brand.accentColor,
                color: "var(--brand-accent-text)",
                padding: `var(--brand-button-py, 12px) var(--brand-button-px, 24px)`,
                borderRadius: `var(--brand-button-radius, ${borderRadius})`,
                minHeight: "44px",
              }}
            >
              <Send className="h-4 w-4" />
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
