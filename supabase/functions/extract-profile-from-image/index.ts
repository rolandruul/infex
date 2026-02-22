// Supabase Edge Function: extract name and city from a Tinder/screenshot image using GPT-4o Vision.
// Set OPENAI_API_KEY in Supabase secrets: supabase secrets set OPENAI_API_KEY=sk-...
import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

interface RequestBody {
  image: string; // base64-encoded image
}

interface Extraction {
  name: string;
  city: string;
  extracted_notes?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), { status: 500 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const imageBase64 = body?.image;
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return new Response(JSON.stringify({ error: "Missing or invalid 'image' (base64 string)" }), { status: 400 });
  }

  const imageUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const systemPrompt = `You are extracting profile information from a screenshot (e.g. from Tinder or a dating app).
Return ONLY a JSON object with exactly these keys: "name", "city", "extracted_notes".
- name: the person's name or display name (string).
- city: the city or location shown (string). Use empty string if not visible.
- extracted_notes: any other visible bio or one-liner (string). Use empty string if none.
If you cannot read the image or find name/city, use empty strings. No markdown, no explanation, only the JSON object.`;

  const userContent = [
    { type: "text", text: "Extract the profile fields from this image. Return only the JSON object." },
    { type: "image_url", image_url: { url: imageUrl } },
  ];

  const openaiBody = {
    model: "gpt-4o",
    max_tokens: 300,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  };

  const openaiRes = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(openaiBody),
  });

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    return new Response(
      JSON.stringify({ error: "OpenAI request failed", detail: errText }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const openaiData = (await openaiRes.json()) as { choices?: { message?: { content?: string } }[] };
  const content = openaiData?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return new Response(JSON.stringify({ error: "No content in OpenAI response" }), { status: 502 });
  }

  let parsed: Extraction;
  try {
    const cleaned = content.replace(/^```json?\s*|\s*```$/g, "").trim();
    parsed = JSON.parse(cleaned) as Extraction;
  } catch {
    return new Response(JSON.stringify({ error: "Could not parse extraction JSON", raw: content }), { status: 502 });
  }

  const result: Extraction = {
    name: String(parsed?.name ?? "").trim() || "Unknown",
    city: String(parsed?.city ?? "").trim() || "",
    extracted_notes: String(parsed?.extracted_notes ?? "").trim() || undefined,
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});
