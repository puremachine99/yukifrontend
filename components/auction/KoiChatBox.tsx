"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatBubble {
  id: number;
  sender: "me" | "other";
  text?: string;
  time: string;
  attachments?: string[];
}

interface ChatBoxProps {
  messages: ChatBubble[];
  onSend: (msg: string) => void;
  loading?: boolean;
}

export function KoiChatBox({ messages = [], onSend, loading }: ChatBoxProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* MESSAGE SCROLLER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-10">

        {messages.map((msg) => {
          const isMe = msg.sender === "me";

          return (
            <div
              key={msg.id}
              className={cn(
                "max-w-sm space-y-1",
                isMe ? "self-end" : "self-start"
              )}
            >
              {/* BUBBLE + ACTION */}
              <div className={cn("flex items-center gap-2", isMe && "justify-end")}>
                
                {/* Bubble */}
                <div
                  className={cn(
                    "inline-flex rounded-md border p-4 bg-muted",
                    isMe ? "order-1" : ""
                  )}
                >
                  {/* Text */}
                  {msg.text && <div className="text-sm">{msg.text}</div>}

                  {/* Grid attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {msg.attachments.map((src, idx) => (
                        <figure
                          key={idx}
                          className="relative cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition"
                        >
                          <img
                            src={src}
                            alt="img"
                            className="aspect-4/3 object-cover w-full h-full"
                          />
                        </figure>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ellipsis menu (not functional – placeholder) */}
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="lucide lucide-ellipsis h-4 w-4"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </div>

              {/* Time + checkmark */}
              <div
                className={cn(
                  "flex items-center gap-2 text-xs text-muted-foreground",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <time>{msg.time}</time>
                {isMe && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="lucide lucide-check-check h-4 w-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 7 17l-5-5" />
                    <path d="m22 10-7.5 7.5L13 16" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t bg-muted/30 flex items-center gap-2 rounded-md">

        <Input
          placeholder="Ketik pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-12 pr-28 bg-white"
        />

        <div className="flex items-center absolute right-4 gap-2">
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-10 px-4"
          >
            <span className="hidden lg:inline">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="lucide lucide-send lg:hidden h-4 w-4"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
          </Button>
        </div>
      </div>

    </div>
  );
}
