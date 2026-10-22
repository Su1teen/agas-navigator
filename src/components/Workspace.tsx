// localized-ui
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  LogOut,
  Boxes,
  LayoutDashboard,
  UploadCloud,
  Truck,
  Settings2,
} from "lucide-react";
import { api, type User } from "@/lib/platform";
import { PlatformAuth } from "./PlatformAuth";
import { UiControls } from "./UiControls";
import { useUi, tr } from "@/lib/ui";
const Session = createContext<User | null>(null);
export const useSession = () => useContext(Session)!;
const nav = [
  ["/", "Обзор", LayoutDashboard],
  ["/catalog", "Каталог", Boxes],
  ["/upload", "Загрузка", UploadCloud],
  ["/orders", "Логистика и продажи", Truck],
  ["/settings", "Настройки и команда", Settings2],
] as const;
export function Workspace({ children }: { children: ReactNode }) {
  useUi();
  useUi();
  const [user, setUser] = useState<User | null>(null),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    api<User>("/auth/me")
      .then((u) => setUser(u.guest ? null : u))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="seller-workspace">
      <header className="glass seller-header">
        <div className="seller-header-inner">
          <Link to="/" className="seller-brand">
            <span>
              <Building2 size={19} />
            </span>
            <strong>AGAS seller</strong>
          </Link>
          <nav className="seller-desktop-nav">
            {tr(
              nav.map(([to, label]) => (
                <Link key={to} to={to} activeOptions={{ exact: to === "/" }}>
                  {tr(tr(label))}
                </Link>
              )),
            )}
          </nav>
          <div className="seller-header-controls">
            <UiControls />
            {tr(
              user && (
                <details className="seller-account">
                  <summary>
                    <span className="seller-avatar">{tr(user.name.slice(0, 2).toUpperCase())}</span>
                    <div>
                      <strong>{tr(user.supplierName || user.name)}</strong>
                      <small>
                        {tr(user.name)} ·{" "}
                        {tr(
                          tr(
                            (
                              {
                                owner: "Владелец",
                                editor: "Редактор",
                                analyst: "Аналитик",
                              } as Record<string, string>
                            )[user.role] || user.role,
                          ),
                        )}
                      </small>
                    </div>
                    <span>⌄</span>
                  </summary>
                  <div className="seller-account-menu">
                    <p>{tr(user.email)}</p>
                    <a
                      href={
                        import.meta.env["VITE_MARKETPLACE_URL"] || "http://localhost:3000/catalog"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tr("Открыть маркетплейс \u2197")}
                    </a>
                    <button onClick={logout}>
                      <LogOut size={14} />
                      {tr("Выйти")}
                    </button>
                  </div>
                </details>
              ),
            )}
          </div>
        </div>
        <nav className="seller-mobile-nav">
          {tr(
            nav.map(([to, label, Icon]) => (
              <Link key={to} to={to} activeOptions={{ exact: to === "/" }}>
                <Icon size={15} />
                {tr(tr(label))}
              </Link>
            )),
          )}
        </nav>
      </header>
      <main className="seller-main">
        {tr(error && <ErrorNotice message={error} />)}{" "}
        {tr(
          !loaded ? (
            <Loading />
          ) : !user ? (
            <PlatformAuth supplier onSuccess={setUser} />
          ) : !user.supplierId ? (
            <section className="platform-panel">
              <h2>{tr("Это аккаунт покупателя")}</h2>
              <p>{tr("Для работы с каталогом войдите в аккаунт поставщика.")}</p>
              <button className="platform-primary" onClick={logout}>
                {tr("Сменить аккаунт")}
              </button>
            </section>
          ) : (
            <Session.Provider value={user}>{tr(children)}</Session.Provider>
          ),
        )}
      </main>
    </div>
  );
}
export function Heading({
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  useUi();
  useUi();
  return (
    <div className="seller-heading">
      <div>
        <h1>{tr(tr(title))}</h1>
        <p>{tr(tr(description))}</p>
      </div>
      <div className="platform-actions">{tr(actions)}</div>
    </div>
  );
}
export function ErrorNotice({
  message,
  retry,
}: {
  message: string;
  retry?: (() => void) | undefined;
}) {
  useUi();
  useUi();
  return (
    <div className="platform-error" role="alert">
      ⚑ {tr(tr(message))}{" "}
      {tr(
        retry && (
          <button onClick={retry} className="platform-link">
            {tr("Повторить")}
          </button>
        ),
      )}
    </div>
  );
}
export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  useUi();
  useUi();
  return (
    <div className="seller-empty">
      <Boxes size={28} />
      <h3>{tr(tr(title))}</h3>
      <p>{tr(tr(description))}</p>
      {tr(action)}
    </div>
  );
}
export function Loading() {
  useUi();
  return (
    <div className="seller-loading" role="status">
      {tr("Загружаем данные\u2026")}
    </div>
  );
}
