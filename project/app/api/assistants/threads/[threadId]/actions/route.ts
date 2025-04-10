import { NextRequest } from 'next/server';
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request: NextRequest, context: any) {
  const { params } = context;
  
  try {
    const { toolCallOutputs, runId } = await request.json();

    if (!toolCallOutputs || !runId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400 }
      );
    }

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      params.threadId,
      runId,
      { tool_outputs: toolCallOutputs }
    );

    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("Error in actions route:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
