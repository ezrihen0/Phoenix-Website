import "server-only";

export function getDeepSeekApiKey() {
  return process.env.DEEPSEEK_API_KEY?.trim() || "";
}

export function getDeepSeekModel() {
  return process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
}

export async function readDeepSeekError(response: Response) {
  const fallback = `DeepSeek request failed with status ${response.status}`;

  try {
    const data = (await response.json()) as {
      error?: {
        message?: string;
      };
    };

    if (data.error?.message) {
      return `${fallback}: ${data.error.message}`;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function requestDeepSeekJsonCompletion({
  systemPrompt,
  userPrompt,
}: {
  systemPrompt: string;
  userPrompt: string;
}) {
  const apiKey = getDeepSeekApiKey();

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getDeepSeekModel(),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readDeepSeekError(response));
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  return content;
}
