export async function generateWithOpenAI(
  prompt: string,
  tool: string,
  apiKey: string
) {
  const systemPrompts: Record<string, string> = {
    code_generator:
      'You are an expert code generator. Generate clean, well-commented code.',
    web_dev:
      'You are a web development expert. Help with HTML, CSS, JavaScript issues.',
    design:
      'You are a UI/UX design advisor. Provide design recommendations and best practices.',
    marketing:
      'You are a marketing copy expert. Write engaging, conversion-focused copy.',
    chat: 'You are a helpful AI assistant.',
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompts[tool] || '' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
