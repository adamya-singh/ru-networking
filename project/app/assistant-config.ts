export let assistantId = "";

if (assistantId === "") {
  const envAssistantId = process.env.OPENAI_ASSISTANT_ID;
  if (!envAssistantId) {
    throw new Error("OPENAI_ASSISTANT_ID environment variable is not set");
  }
  assistantId = envAssistantId;
}
