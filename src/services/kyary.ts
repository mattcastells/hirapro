export type KyaryHistoryMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export type KyaryReply = {
  text: string;
  model: string;
};

const GEMINI_API_KEY = 'AIzaSyA9Wp1PqWfKIliEnD2MC5aTpIbRfCYv8_M';
const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `Sos Kyary, una asistente virtual especializada en la enseñanza del idioma japonés.

Tu personalidad:
- Sos amigable, paciente y alentadora. Usas un tono cálido pero conciso.
- Hablás en español rioplatense (vos, tenés, podés, etc).
- Usás emojis japoneses y kaomojis con moderación para darle vida al chat (ej: ✨, 🌸, (◕‿◕)).
- Celebras los logros del usuario con entusiasmo genuino.

Tu expertise:
- Hiragana y katakana: lectura, escritura, trazos, orden de trazos, diferencias visuales entre caracteres similares.
- Vocabulario japonés básico e intermedio.
- Gramática japonesa: partículas, conjugaciones, estructuras de oraciones.
- Pronunciación y romanización (romaji).
- Cultura japonesa relevante al aprendizaje del idioma.
- Kanji básico.

Reglas:
- Respondé siempre en español, pero incluí los términos japoneses en su escritura original (kana/kanji) junto con el romaji entre paréntesis.
- Si el usuario escribe en japonés, corregí errores amablemente y explicá la corrección.
- Si el usuario pide practicar, proponé ejercicios cortos e interactivos.
- Mantené las respuestas concisas. No hagas paredes de texto.
- Si te preguntan algo que no tiene que ver con japonés o aprendizaje de idiomas, respondé brevemente que tu especialidad es el japonés y redirigí la conversación.
- Nunca inventes reglas gramaticales o datos del idioma. Si no estás segura, decilo.

Formato:
- Responde solo con texto plano legible, sin formato JSON ni bloques de código.
- Usá saltos de línea para separar ideas.`;

const extractOutputText = (payload: Record<string, unknown>): string => {
  const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
  const chunks: string[] = [];

  candidates.forEach((candidate) => {
    if (!candidate || typeof candidate !== 'object') return;
    const content = (candidate as { content?: unknown }).content;
    if (!content || typeof content !== 'object') return;

    const parts = Array.isArray((content as { parts?: unknown }).parts)
      ? (content as { parts: unknown[] }).parts
      : [];
    parts.forEach((part) => {
      if (!part || typeof part !== 'object') return;
      const text = (part as { text?: unknown }).text;
      if (typeof text === 'string' && text.trim()) {
        chunks.push(text.trim());
      }
    });
  });

  return chunks.join('\n\n').trim();
};

export async function sendKyaryMessage(
  history: KyaryHistoryMessage[],
): Promise<KyaryReply> {
  const normalizedHistory = history
    .map((message) => ({
      role: message.role,
      text: message.text.trim(),
    }))
    .filter((message) => message.text.length > 0);

  if (normalizedHistory.length === 0) {
    throw new Error('Escribí una consulta para Kyary.');
  }

  const contents = normalizedHistory.map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.text }],
  }));

  let response: Response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.45,
          },
        }),
      },
    );
  } catch {
    throw new Error('No se pudo conectar con Kyary. Revisá tu conexión.');
  }

  const responsePayload = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const errorObj = responsePayload.error;
    const errorMessage =
      typeof errorObj === 'object' &&
      errorObj &&
      typeof (errorObj as { message?: unknown }).message === 'string'
        ? (errorObj as { message: string }).message
        : 'Kyary no pudo responder en este momento.';

    throw new Error(errorMessage);
  }

  const text = extractOutputText(responsePayload);

  if (!text) {
    throw new Error('Kyary no devolvió una respuesta útil. Probá de nuevo.');
  }

  return { text, model: GEMINI_MODEL };
}
