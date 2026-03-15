import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { requireAuth } from '@/lib/api-auth';

// Lazy-initialize to avoid crash when ANTHROPIC_API_KEY is not set
let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not configured. Add it in Settings → Integrations or set it as an environment variable.'
    );
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

type BlogWriterMode = 'outline' | 'article' | 'improve' | 'seo';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const {
      mode,
      topic,
      keyword,
      tone = 'informative',
      wordCount = 800,
      outline,
      sectionIndex,
      sectionContent,
      sectionTitle,
    }: {
      mode: BlogWriterMode;
      topic?: string;
      keyword?: string;
      tone?: 'informative' | 'casual' | 'persuasive' | 'professional';
      wordCount?: number;
      outline?: string[];
      sectionIndex?: number;
      sectionContent?: string;
      sectionTitle?: string;
    } = body;

    if (!mode) {
      return NextResponse.json({ error: 'mode is required' }, { status: 400 });
    }

    // ─── Outline generation ───────────────────────────────────────────
    if (mode === 'outline') {
      if (!topic) return NextResponse.json({ error: 'topic is required for outline mode' }, { status: 400 });

      const message = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Create a blog post outline for the topic: "${topic}"
${keyword ? `Target keyword: "${keyword}"` : ''}
Tone: ${tone}
Target length: ~${wordCount} words

Return ONLY a JSON object in this exact format, no other text:
{
  "title": "Compelling blog post title with keyword if provided",
  "sections": [
    "Introduction — hook and what reader will learn",
    "Section 2 heading",
    "Section 3 heading",
    "Section 4 heading",
    "Conclusion — key takeaways and CTA"
  ]
}

Use 4-6 sections. Make the title compelling and SEO-friendly.`,
        }],
      });

      const text = message.content[0].type === 'text' ? message.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return NextResponse.json({ error: 'Failed to parse outline' }, { status: 500 });
      const parsed = JSON.parse(match[0]);
      return NextResponse.json({ outline: parsed });
    }

    // ─── Full article generation ──────────────────────────────────────
    if (mode === 'article') {
      if (!topic || !outline?.length) {
        return NextResponse.json({ error: 'topic and outline are required for article mode' }, { status: 400 });
      }

      const toneGuide = {
        informative: 'educational, clear, factual, uses examples and data',
        casual: 'conversational, friendly, uses contractions and relatable language',
        persuasive: 'compelling, uses social proof, addresses objections, drives action',
        professional: 'authoritative, formal, precise, industry-credible',
      }[tone];

      const message = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Write a blog post about: "${topic}"
${keyword ? `Naturally incorporate this keyword: "${keyword}"` : ''}
Tone: ${tone} (${toneGuide})
Target word count: ~${wordCount} words

Follow this outline:
${outline.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Format as Markdown:
- Use # for the title (H1)
- Use ## for section headings (H2)
- Use **bold** for key terms
- Use bullet lists where appropriate
- Add a compelling intro paragraph
- End with a strong conclusion and call-to-action
- Naturally weave in the keyword without keyword stuffing

Return ONLY the markdown content, no preamble.`,
        }],
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';
      return NextResponse.json({ content });
    }

    // ─── Section improvement ──────────────────────────────────────────
    if (mode === 'improve') {
      if (!sectionContent) {
        return NextResponse.json({ error: 'sectionContent is required for improve mode' }, { status: 400 });
      }

      const message = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Rewrite and improve this blog section${sectionTitle ? ` titled "${sectionTitle}"` : ''}:

---
${sectionContent}
---

Make it:
- More engaging and readable
- Better structured with clear flow
- ${tone === 'casual' ? 'Conversational and friendly' : tone === 'persuasive' ? 'More compelling with stronger hooks' : tone === 'professional' ? 'More authoritative and precise' : 'Clearer and more educational'}
${keyword ? `- Naturally incorporate the keyword: "${keyword}"` : ''}

Return ONLY the improved markdown section content, no preamble or explanation.`,
        }],
      });

      const improved = message.content[0].type === 'text' ? message.content[0].text : '';
      return NextResponse.json({ improved });
    }

    // ─── SEO suggestions ─────────────────────────────────────────────
    if (mode === 'seo') {
      if (!topic || !sectionContent) {
        return NextResponse.json({ error: 'topic and sectionContent are required for seo mode' }, { status: 400 });
      }

      const message = await getClient().messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Generate SEO metadata for a blog post about "${topic}":

Article excerpt:
${sectionContent.slice(0, 500)}

${keyword ? `Focus keyword: "${keyword}"` : ''}

Return ONLY a JSON object, no other text:
{
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "Compelling meta description 120-160 chars",
  "focusKeyword": "the main keyword to target",
  "keywordDensitySuggestion": "Brief advice on keyword usage"
}`,
        }],
      });

      const text = message.content[0].type === 'text' ? message.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return NextResponse.json({ error: 'Failed to parse SEO data' }, { status: 500 });
      return NextResponse.json({ seo: JSON.parse(match[0]) });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (err) {
    console.error('Blog writer error:', err);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
