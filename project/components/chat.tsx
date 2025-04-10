"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css"; // Keep your CSS module import
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

// 1) Wrap user messages in a "container" so we can float them to the right
const UserMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.userMessageContainer}>
      <div className={styles.userMessage}>{text}</div>
    </div>
  );
};

// 2) Wrap assistant messages in a "container" so they float left
const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessageContainer}>
      <div className={styles.assistantMessage}>
        <Markdown>{text}</Markdown>
      </div>
    </div>
  );
};

// 3) Code messages can re-use the assistant container if you like, or a different one
const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessageContainer}>
      <div className={styles.codeMessage}>
        {text.split("\n").map((line, index) => (
          <div key={index}>
            <span>{`${index + 1}. `}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

type ToolCallOutput = {
  output: string;
  tool_call_id: string;
};

type ToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

type ErrorType = 
  | 'network'
  | 'api'
  | 'stream'
  | 'tool'
  | 'unknown';

const getErrorMessage = (error: Error, type: ErrorType): string => {
  switch (type) {
    case 'network':
      return "Sorry, there was a network error. Please check your connection and try again.";
    case 'api':
      return "Sorry, there was an error with the API. Please try again later.";
    case 'stream':
      return "Sorry, there was an error in the stream. Please try again.";
    case 'tool':
      return "Sorry, there was an error processing the tool call. Please try again.";
    case 'unknown':
      return "Sorry, an unexpected error occurred. Please try again.";
  }
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const activeStreams = useRef<AssistantStream[]>([]);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      // Clear the active streams array
      activeStreams.current = [];
    };
  }, []);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const handleError = (error: Error, type: ErrorType) => {
    console.error(`Error (${type}):`, error);
    setInputDisabled(false);
    appendMessage("assistant", getErrorMessage(error, type));
  };

  const sendMessage = async (text: string) => {
    try {
      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content: text,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('No response body received');
      }
      
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (error) {
      handleError(error as Error, 'api');
    }
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    try {
      const response = await fetch(
        `/api/assistants/threads/${threadId}/actions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            runId: runId,
            toolCallOutputs: toolCallOutputs,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('No response body received');
      }
      
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (error) {
      handleError(error as Error, 'api');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  /* Stream Event Handlers */

  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  const handleImageFileDone = (image: any) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type !== "code_interpreter") return;
    appendMessage("code", "");
  };

  const toolCallDelta = (delta: any, snapshot: any) => {
    if (delta.type !== "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    try {
      const runId = event.data.id;
      const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
      
      const toolCallOutputs: ToolCallOutput[] = await Promise.all(
        toolCalls.map(async (toolCall: RequiredActionFunctionToolCall) => {
          try {
            const result = await functionCallHandler(toolCall);
            return {
              output: result,
              tool_call_id: toolCall.id
            };
          } catch (error) {
            handleError(error as Error, 'tool');
            return {
              output: "Error processing tool call",
              tool_call_id: toolCall.id
            };
          }
        })
      );

      setInputDisabled(true);
      await submitActionResult(runId, toolCallOutputs);
    } catch (error) {
      handleError(error as Error, 'api');
    }
  };

  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // Add stream to active streams
    activeStreams.current.push(stream);

    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // requires_action and run.done
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });

    // Handle stream completion
    stream.on("end", () => {
      // Remove stream from active streams
      activeStreams.current = activeStreams.current.filter(s => s !== stream);
    });

    // Handle stream errors
    stream.on("error", (error) => {
      handleError(error as Error, 'stream');
      // Remove stream from active streams
      activeStreams.current = activeStreams.current.filter(s => s !== stream);
    });
  };

  /* Utility Helpers */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: "assistant" | "user" | "code", text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any[]) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = { ...lastMessage };
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;