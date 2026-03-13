import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function suggestBrandNames(industry: string, keywords: string[]): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate 6 unique, creative brand names for a ${industry} business. Keywords: ${keywords.join(', ')}. 
        
Return ONLY a JSON array of strings, no other text. Example: ["Name1", "Name2", "Name3"]`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

export async function suggestTaglines(brandName: string, industry: string): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate 5 compelling taglines for a brand called "${brandName}" in the ${industry} industry.
        
Return ONLY a JSON array of strings, no other text. Example: ["Tagline 1", "Tagline 2"]`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

export async function generateProductDescription(productName: string, brandName: string, brandVoice?: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Write a compelling product description for "${productName}" by ${brandName}.${brandVoice ? ` Brand voice: ${brandVoice}.` : ''} 
        
Keep it concise (2-3 sentences), engaging, and focused on benefits. Return ONLY the description text, no quotes or extra formatting.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text.trim() : '';
}

export async function generateContent(params: {
  brandName: string;
  brandVoice?: string;
  type: 'blog' | 'social' | 'email' | 'about' | 'landing';
  topic?: string;
  products?: Array<{ name: string; description?: string }>;
}): Promise<{ title: string; body: string }> {
  const typePrompts: Record<string, string> = {
    blog: `Write a blog post for ${params.brandName}. Topic: ${params.topic || 'company introduction'}. Include a title and 3-4 paragraphs.`,
    social: `Write 5 social media posts for ${params.brandName}. Mix of promotional and engaging content. Each post should be under 280 characters.`,
    email: `Write a welcome email template for ${params.brandName}. Include subject line and body. Professional but warm.`,
    about: `Write an About Us page for ${params.brandName}. Include the brand story, mission, and values. 3-4 paragraphs.`,
    landing: `Write landing page copy for ${params.brandName}. Include headline, subheadline, 3 feature descriptions, and a CTA section.`,
  };

  const productContext = params.products?.length
    ? `\nProducts/Services: ${params.products.map(p => `${p.name}: ${p.description || ''}`).join('; ')}`
    : '';

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `${typePrompts[params.type]}${productContext}${params.brandVoice ? `\nBrand voice: ${params.brandVoice}` : ''}

Return as JSON: {"title": "...", "body": "..."}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { title: 'Untitled', body: text };
  } catch {
    return { title: 'Untitled', body: text };
  }
}

export async function chatWithBrand(params: {
  brandName: string;
  brandVoice?: string;
  products?: Array<{ name: string; description?: string; price?: number }>;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  message: string;
}): Promise<string> {
  const systemPrompt = `You are a helpful customer support assistant for ${params.brandName}. ${params.brandVoice ? `Your tone is: ${params.brandVoice}.` : ''} 
${params.products?.length ? `Products/Services available: ${params.products.map(p => `${p.name} ($${p.price || 'TBD'}): ${p.description || 'No description'}`).join('; ')}` : ''}
Be helpful, concise, and on-brand. If asked about something you don't know, politely say you'll connect them with the team.`;

  const messages = [
    ...params.history.map(h => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user' as const, content: params.message },
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function analyzeBrandVoice(description: string): Promise<{
  tone: string;
  personality: string[];
  sampleGreeting: string;
}> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Analyze this brand description and suggest a brand voice:
"${description}"

Return as JSON: {"tone": "one-word tone", "personality": ["trait1", "trait2", "trait3"], "sampleGreeting": "A sample greeting in this voice"}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { tone: 'professional', personality: ['helpful'], sampleGreeting: 'Welcome!' };
  } catch {
    return { tone: 'professional', personality: ['helpful'], sampleGreeting: 'Welcome!' };
  }
}
