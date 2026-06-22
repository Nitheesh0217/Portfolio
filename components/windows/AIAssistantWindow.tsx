// components/windows/AIAssistantWindow.tsx
// Streaming AI chat powered by /api/assistant (Claude Haiku + Neon RAG context)
'use client';

import {
  memo, useState, useRef, useCallback, useEffect,
} from 'react';
import { Send, StopCircle, Bot, User } from 'lucide-react';

interface Message {
  id:      string;
  role:    'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const STARTERS = [
  'What makes Nitheesh stand out from other AI engineers?',
  'Tell me about the D Scent House project and its ROI.',
  'How does the Kore.ai customer service agent work?',
  "What's Nitheesh's approach to system reliability?",
  'Walk me through his RAG experience at Citrix.',
];

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isUser ? 'bg-violet-600' : 'bg-white/[0.08]'}`}>
        {isUser ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-violet-300" />}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : msg.isError
          ? 'bg-red-500/10 border border-red-400/20 text-red-300/80 rounded-tl-sm'
          : 'bg-white/[0.06] border border-white/[0.06] text-white/70 rounded-tl-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <div className="shrink-0 w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center">
        <Bot className="w-3 h-3 text-violet-300" />
      </div>
      <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </div>
  );
}

export const AIAssistantWindow = memo(function AIAssistantWindow() {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [input,       setInput]       = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef   = useRef<AbortController | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setInput('');

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    const history = messages
      .filter((m) => !m.isError)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history }),
        signal:  abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const payload = JSON.parse(raw);
            if (payload.error) throw new Error(payload.error);
            if (payload.text) {
              setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: m.content + payload.text } : m));
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setMessages((prev) => prev.map((m) => m.id === assistantId
        ? { ...m, content: 'Something went wrong. Check that ANTHROPIC_API_KEY is set and try again.', isError: true }
        : m,
      ));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }, [input, send]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const showTyping = isStreaming && messages.at(-1)?.role === 'assistant' && messages.at(-1)?.content === '';

  return (
    <div className="flex flex-col" style={{ width: '440px', height: '480px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.2) transparent' }}>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Bot className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white/70">Ask me about Nitheesh</p>
              <p className="text-[11px] text-white/30 mt-0.5">I have full context of his projects, skills, and impact.</p>
            </div>
            <div className="flex flex-col gap-1.5 w-full max-w-[300px]">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-[11px] text-white/45 hover:text-white/75 px-3 py-2 rounded-xl border border-white/[0.06] hover:border-violet-500/25 hover:bg-violet-500/[0.06] transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)}
        {showTyping && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about projects, stack, experience…"
            disabled={isStreaming}
            className="flex-1 resize-none bg-white/[0.05] border border-white/[0.08] focus:border-violet-500/40 rounded-xl px-3.5 py-2.5 text-[12px] text-white/80 placeholder:text-white/20 outline-none transition-colors leading-relaxed"
            style={{ maxHeight: '80px', scrollbarWidth: 'none' }}
          />
          {isStreaming ? (
            <button onClick={handleStop} aria-label="Stop"
              className="shrink-0 w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all active:scale-95">
              <StopCircle className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => send(input)} disabled={!input.trim()} aria-label="Send"
              className="shrink-0 w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95">
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[9px] text-white/15 mt-1.5 text-center font-mono">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  );
});
