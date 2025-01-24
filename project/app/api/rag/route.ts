import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // or however you set your key
});

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body for entire messages array plus any existing threadId
    const { messages, threadId } = await req.json();

    // 2. If no threadId, create a new Thread
    let activeThreadId = threadId;
    if (!activeThreadId) {
      const thread = await openai.beta.threads.create();
      activeThreadId = thread.id;
    }

    // 3. Add *all* previous messages to the Thread
    for (const m of messages) {
      await openai.beta.threads.messages.create(activeThreadId, {
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      });
    }

    // 4. Prepare the streaming Run
    const stream = openai.beta.threads.runs.stream(activeThreadId, {
      assistant_id: "asst_yhA0GKRbKWUHkL97aMCK5flV", // use your known assistant ID
    });

    // 5. Construct SSE response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("textCreated", () => {
          controller.enqueue(encoder.encode(`data: \n\n`));
        });
        stream.on("textDelta", (delta) => {
          controller.enqueue(encoder.encode(`data: ${delta.value}\n\n`));
        });

        stream.on("toolCallCreated", (toolCall) => {
          controller.enqueue(encoder.encode(`data: [TOOL] ${toolCall.type}\n\n`));
        });
        stream.on("toolCallDelta", (toolCallDelta) => {
          // handle tool outputs if needed
        });

        stream.on("end", () => {
          controller.close();
        });
        stream.on("error", (err) => {
          controller.error(err);
        });
      },
    });

    // (Optionally call stream.start() if required by your environment)
    // stream.start();

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Error in chat route:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}