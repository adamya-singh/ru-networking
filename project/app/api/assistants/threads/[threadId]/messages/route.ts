import { NextRequest } from 'next/server';
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request: NextRequest, context: any) {
  const { params } = context;
  const { content } = await request.json();

  await openai.beta.threads.messages.create(params.threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(params.threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
