const SYSTEM_PROMPT = `אתה עוזר קולי יעיל בעברית עבור שיחות טלפון.
ענה בעברית פשוטה, במשפטים קצרים שמתאימים להקראה בטלפון.
אל תשתמש בטבלאות, Markdown, קישורים ארוכים או אימוג'ים.
אם חסר מידע, שאל שאלה אחת קצרה.
אל תטען שביצעת פעולה שלא ביצעת.`;

export async function runAgent({ message, sessionId }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return `קיבלתי את ההודעה: ${message}. כדי להפעיל תשובות חכמות, יש להגדיר את מפתח OpenAI במשתני הסביבה של Vercel.`;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `מזהה שיחה: ${sessionId}\nהודעה: ${message}` }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("AI provider error:", response.status, detail.slice(0, 500));
    throw new Error(`AI provider returned ${response.status}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content?.trim();
  return answer || "לא הצלחתי לנסח תשובה. אפשר לנסות שוב.";
}