import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  UploadCloud,
  Truck,
  Settings2,
  Building2,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AiAssistant } from "@/components/ai-assistant";

const NAV = [
  { to: "/", key: "nav_dashboard", icon: LayoutDashboard },
  { to: "/catalog", key: "nav_catalog", icon: Boxes },
  { to: "/upload", key: "nav_upload", icon: UploadCloud },
  { to: "/orders", key: "nav_orders", icon: Truck },
  { to: "/settings", key: "nav_settings", icon: Settings2 },
] as const;

function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-border bg-secondary/70 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
            value === o.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const t = useT();
  const { lang, currency, setLang, setCurrency } = useApp();

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-40 border-x-0 border-t-0 rounded-none">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">{t("brand")}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <SegmentedToggle
              value={lang}
              onChange={setLang}
              options={[
                { value: "en" as const, label: "EN" },
                { value: "ru" as const, label: "RU" },
              ]}
            />
            <SegmentedToggle
              value={currency}
              onChange={setCurrency}
              options={[
                { value: "USD" as const, label: "$ USD" },
                { value: "KZT" as const, label: "₸ KZT" },
              ]}
            />
            <div className="hidden items-center gap-2.5 rounded-full border border-border bg-card/70 py-1 pl-1 pr-3 md:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                AS
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-medium">
                  SGK <span className="text-muted-foreground">(Smart Group Kazakhstan)</span>
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  Aigerim Sultanova · Owner
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              <item.icon className="h-3.5 w-3.5" />
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8">{children}</main>
      <AiAssistant />
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-[28px] font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}