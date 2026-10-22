import { useState } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { AI_ANSWERS, AI_FALLBACK } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; text: string };

function answerFor(question: string, lang: "en" | "ru") {
  const q = question.toLowerCase();
  const hit = AI_ANSWERS.find((a) => a.q.some((k) => q.includes(k)));
  return hit ? hit[lang] : AI_FALLBACK[lang];
}

const SUGGESTIONS = {
  en: ["What is my best selling product?", "What needs restocking?", "How are my margins?"],
  ru: ["Какой товар продаётся лучше всего?", "Что нужно пополнить?", "Какая у меня маржа?"],
};

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function AiAssistant() {
  const lang = useApp((s) => s.lang);
  const t = useT();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        lang === "en"
          ? "Hi Aigerim — I have full visibility into the SGK catalog, orders and margins. What would you like to review?"
          : "Здравствуйте, Айгерим — у меня полный доступ к каталогу, заказам и марже SGK. Что посмотрим?",
    },
  ]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: value },
      { role: "assistant", text: answerFor(value, lang) },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-13 items-center gap-2 rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
      >
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        <span className="hidden sm:inline">{t("ai_assistant")}</span>
      </button>

      <div
        className={cn(
          "glass-panel fixed bottom-24 right-6 z-50 flex w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">{t("ai_assistant")}</p>
          <p className="text-[11px] text-muted-foreground">SGK · {t("tenant")}</p>
        </div>

        <div className="flex max-h-[22rem] flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                m.role === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-secondary text-foreground",
              )}
            >
              {renderBold(m.text)}
            </div>
          ))}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTIONS[lang].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ai_placeholder")}
            className="min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40"
            disabled={!input.trim()}
            aria-label={t("send")}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
