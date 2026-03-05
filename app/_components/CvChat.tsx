"use client";

import { useEffect, useRef, useState } from "react";

type CvChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CvChatState =
  | { status: "idle"; messages: CvChatMessage[] }
  | { status: "loading"; messages: CvChatMessage[] }
  | { status: "error"; messages: CvChatMessage[]; error: string };

const initialMessages: CvChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I'm Apuälynen, chatbot. Ask me anything about my experience, skills, or background and I'll answer based on Tero's CV.",
  },
];

const RobotIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    <path d="M9 18h6" />
  </svg>
);

const RobotAvatar = () => (
  <div className="flex-shrink-0 flex size-7 items-center justify-center rounded-full bg-green-200 text-green-800">
    <RobotIcon />
  </div>
);

export const CvChat = () => {
  const [state, setState] = useState<CvChatState>({
    status: "idle",
    messages: initialMessages,
  });
  const [inputValue, setInputValue] = useState("");
  const trimmed = inputValue.trim();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmed) {
      return;
    }

    const newMessages = state.messages.concat([
      { role: "user", content: trimmed },
    ]);

    setState({
      status: "loading",
      messages: newMessages,
    });
    setInputValue("");

    try {
      const response = await fetch("/api/cv-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const json = (await response.json()) as {
        content?: string;
        error?: string;
      };

      if (!response.ok) {
        setState({
          status: "error",
          messages: newMessages,
          error: json.error || "Something went wrong while talking to the CV.",
        });
        return;
      }

      setState({
        status: "idle",
        messages: newMessages.concat([
          {
            role: "assistant",
            content: json.content || "",
          },
        ]),
      });
    } catch (error) {
      setState({
        status: "error",
        messages: newMessages,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while talking to the CV.",
      });
    }
  };

  const renderMessage = (message: CvChatMessage, index: number) => {
    const isUser = message.role === "user";

    return (
      <div
        key={index}
        className={
          "flex items-start gap-2 " + (isUser ? "justify-end" : "justify-start")
        }
      >
        {!isUser && <RobotAvatar />}
        <div
          className={
            "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 " +
            (isUser
              ? "bg-green-800 text-white"
              : "bg-green-100 text-neutral-900")
          }
        >
          {message.content}
        </div>
      </div>
    );
  };

  const isLoading = state.status === "loading";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, isLoading]);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl bg-neutral-50 p-3 sm:p-4">
          {state.messages.map(renderMessage)}
          {isLoading ? (
            <div className="flex items-start gap-2 justify-start">
              <RobotAvatar />
              <div className="rounded-2xl bg-green-100 px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 rounded-full bg-neutral-500 animate-bounce" />
                </div>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {state.status === "error" ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {state.error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50/80 p-3 sm:p-4"
        >
          <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Ask the CV
          </label>
          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="For example: what kind of roles has Tero worked in recently?"
              className="flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={isLoading || !trimmed}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isLoading ? "Sending…" : "Ask"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
