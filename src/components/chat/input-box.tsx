"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputBoxProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBox({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: InputBoxProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 2000;
  const maxLines = 5;

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        40 * maxLines
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (content.trim() && !disabled) {
      onSend(content);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for newlines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = content.length;
  const isNearLimit = charCount > maxChars * 0.9;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              setContent(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-saffron/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          rows={1}
          style={{ minHeight: "40px" }}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !content.trim()}
          size="icon"
          className="flex-shrink-0 h-10 w-10 bg-saffron hover:bg-saffron/90 text-primary-foreground self-end"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Character count */}
      <div className="text-xs text-muted-foreground px-1">
        <span
          className={isOverLimit ? "text-destructive font-semibold" : isNearLimit ? "text-amber-600" : ""}
        >
          {charCount}
        </span>
        / {maxChars} characters
      </div>
    </div>
  );
}
