// components/windows/AIAssistantWindow.tsx
'use client';

import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Send, StopCircle, Sparkles, User, ArrowRight } from 'lucide-react';
import { TOKENS, accentBox } from '@/lib/designTokens';

interface Message {
  id:       string;
  role:     'user' | 'assistant';
  content:  string;
  isError?: boolean;
}

const STARTERS = [
  "What makes Nitheesh stand out from other AI engineers?",
  "Tell me about the D Scent House project and its ROI.",
  "Walk me through his RAG experience at Citrix.",
  "What's his approach to system reliability?",
];

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
        style={isUser
          ? { background: `linear-gradient(135deg, ${TOKENS.violet}, #6d28d9)` }
          : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
        }
      >
        {isUser
          ? <User style={{ width: 11, height: 11, color: '#fff' }} />
          : <Sparkles style={{ width: 11, height: 11, color: TOKENS.violet }} />
        }
      </div>

      <div
        className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed"
        style={isUser ? {
          background: `linear-gradient(135deg, ${TOKENS.violet}60, ${TOKENS.violet}40)`,
          border: `1px solid ${TOKENS.violet}40`,
          color: 'rgba(255,255,255,0.90)',
          borderTopRightRadius: 4,
        } : msg.isError ? {
          background: `${TOKENS.rose}10`,
          border: `1px solid ${TOKENS.rose}25`,
          color: `${TOKENS.rose}CC`,
          borderTopLeftRadius: 4,
        } : {
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.75)',
          borderTopLeftRadius: 4,
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <div
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Sparkles style={{ width: 11, height: 11, color: TOKENS.violet }} />
      </div>
      <div
        className="rounded-2xl rounded-tl-[4px] px-3.5 py-3 flex items-center gap-1"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: `${TOKENS.violet}60`, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export const AIAssistantWindow = memo(function AIAssistantWindow() {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [input,       setInput]       = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef    = useRef<AbortController | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isStreaming]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setInput('');
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    const history = messages.filter((m) => !m.isError).slice(-10).map((m) => ({ role: m.role, content: m.content }));
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
        signal: abortRef.current.signal,
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
        ? { ...m, content: 'Something went wrong. Check ANTHROPIC_API_KEY and try again.', isError: true }
        : m));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }, [input, send]);

  const showTyping = isStreaming && messages.at(-1)?.role === 'assistant' && messages.at(-1)?.content === '';

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-6 pt-6 pb-4 border-b"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={accentBox(TOKENS.violet)}>
          <Sparkles style={{ width: 15, height: 15, color: TOKENS.violet }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-black text-white tracking-tight">AI Sidekick</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Full context on Nitheesh&rsquo;s projects &amp; skills</p>
        </div>
        {/* Online indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold"
          style={{ background: `${TOKENS.emerald}10`, border: `1px solid ${TOKENS.emerald}25`, color: TOKENS.emerald }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TOKENS.emerald }} />
          Online
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 min-h-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={accentBox(TOKENS.violet)}
            >
              <Sparkles style={{ width: 26, height: 26, color: TOKENS.violet }} />
            </div>
            <div>
              <p className="text-[14px] font-black text-white/80">Ask me anything</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>
                I know Nitheesh&rsquo;s projects, stack, and impact cold.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 w-full max-w-[320px]">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex items-center gap-2 text-left text-[11px] px-3.5 py-2.5 rounded-xl transition-all group"
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${TOKENS.violet}35`;
                    e.currentTarget.style.background = `${TOKENS.violet}08`;
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  }}
                >
                  <ArrowRight style={{ width: 12, height: 12, flexShrink: 0, color: TOKENS.violet, opacity: 0.6 }} />
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
      <div
        className="shrink-0 border-t px-5 py-4"
        style={{ borderColor: TOKENS.border.base }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about projects, stack, experience…"
            disabled={isStreaming}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-[12px] text-white/80 placeholder:text-white/20 outline-none transition-all leading-relaxed"
            style={{
              maxHeight: '80px',
              scrollbarWidth: 'none',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${input ? `${TOKENS.violet}40` : 'rgba(255,255,255,0.08)'}`,
            }}
          />
          {isStreaming ? (
            <button
              onClick={() => { abortRef.current?.abort(); setIsStreaming(false); }}
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
              style={{ background: `${TOKENS.rose}20`, border: `1px solid ${TOKENS.rose}30`, color: TOKENS.rose }}
            >
              <StopCircle style={{ width: 16, height: 16 }} />
            </button>
          ) : (
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.violet}, #6d28d9)`,
                boxShadow: input.trim() ? `0 4px 16px ${TOKENS.violet}30` : 'none',
              }}
            >
              <Send style={{ width: 15, height: 15, color: '#fff' }} />
            </button>
          )}
        </div>
        <p className="text-[9px] text-center mt-1.5 font-mono" style={{ color: 'rgba(255,255,255,0.12)' }}>
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
});
