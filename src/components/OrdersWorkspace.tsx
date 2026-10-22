// localized-ui
import { tr, useUi } from "@/lib/ui";
import { useState, type FormEvent } from "react";
import { Download, Plus } from "lucide-react";
import { API, api, money, useResource } from "@/lib/platform";
import { Heading, Empty, Loading, ErrorNotice, useSession } from "./Workspace";
type Line = {
  invoice_id: string;
  seq: number;
  name: string;
  sku: string;
  quantity: number;
  unit_minor: number;
  total_minor: number;
  status: string;
  created_at: string;
};
type Lead = {
  id: string;
  name: string;
  email: string;
  note: string;
  status: string;
};
const statuses: Record<string, string> = {
  new: "Новый",
  contacted: "Связались",
  won: "Успешно",
  lost: "Закрыт",
};
export function OrdersWorkspace() {
  useUi();
  useUi();
  const orders = useResource<Line[]>("/supplier/orders", []),
    leads = useResource<Lead[]>("/supplier/leads", []),
    user = useSession();
  const editable = ["owner", "editor"].includes(user.role);
  const [tab, setTab] = useState("orders"),
    [form, setForm] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await api("/supplier/leads", { method: "POST", body: JSON.stringify(Object.fromEntries(f)) });
      setForm(false);
      setNotice("Контакт сохранён");
      leads.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function update(id: string, status: string) {
    setBusy(true);
    setError("");
    try {
      await api(`/supplier/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setNotice("Статус обновлён");
      leads.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow={"ПРОДАЖИ И КОНТАКТЫ"}
        title={tr("Заказы и CRM")}
        description={"Строки заказов вашей компании и рабочие контакты с покупателями."}
        actions={
          <a className={"platform-secondary"} href={`${API}/api/supplier/orders/export`}>
            <Download size={17} />
            {tr("Заказы в Excel")}
          </a>
        }
      />
      <div className={"seller-tabs"}>
        <button aria-pressed={tab === "orders"} onClick={() => setTab("orders")}>
          {tr("Заказы \u00B7 ")}
          {tr(new Set(orders.data.map((o) => o.invoice_id)).size)}
        </button>
        <button aria-pressed={tab === "leads"} onClick={() => setTab("leads")}>
          {tr("Контакты \u00B7 ")}
          {tr(leads.data.length)}
        </button>
      </div>
      {tr(
        (error || orders.error || leads.error) && (
          <ErrorNotice message={error || orders.error || leads.error} />
        ),
      )}
      {tr(" ")}
      {tr(
        notice && (
          <p className={"platform-success"} role={"status"}>
            {tr(notice)}
          </p>
        ),
      )}
      {tr(
        tab === "orders" ? (
          <section className={"platform-panel seller-table-panel"}>
            {tr(
              orders.loading ? (
                <Loading />
              ) : orders.data.length ? (
                <div className={"seller-table-scroll"}>
                  <table className={"seller-table"}>
                    <thead>
                      <tr>
                        <th>{tr("Счёт / дата")}</th>
                        <th>{tr("Товар")}</th>
                        <th>{tr("Количество")}</th>
                        <th>{tr("Цена")}</th>
                        <th>{tr("Сумма")}</th>
                        <th>{tr("Статус")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tr(
                        orders.data.map((l) => (
                          <tr key={`${l.invoice_id}-${l.sku}`}>
                            <td>
                              <strong>
                                {tr("AGAS-")}
                                {tr(String(l.seq).padStart(8, "0"))}
                              </strong>
                              <small>
                                {tr(
                                  new Date(l.created_at.replace(" ", "T") + "Z").toLocaleDateString(
                                    "ru-RU",
                                  ),
                                )}
                              </small>
                            </td>
                            <td>
                              {tr(l.name)}
                              <small>{tr(l.sku)}</small>
                            </td>
                            <td>{tr(l.quantity)}</td>
                            <td>{tr(money(l.unit_minor))}</td>
                            <td>{tr(money(l.total_minor))}</td>
                            <td>
                              <span className={"platform-badge"}>{tr("Ожидает оплаты")}</span>
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  title={tr("Заказов пока нет")}
                  description={
                    "Они появятся, когда покупатель сформирует счёт с вашими товарами на маркетплейсе."
                  }
                />
              ),
            )}
          </section>
        ) : (
          <section className={"platform-panel"}>
            <div className={"seller-section-heading"}>
              <div>
                <h2>{tr("Контакты покупателей")}</h2>
                <p>{tr("Добавляйте обращения и отслеживайте этап общения.")}</p>
              </div>
              {tr(
                editable && (
                  <button className={"platform-primary"} onClick={() => setForm(!form)}>
                    <Plus size={16} />
                    {tr("Добавить контакт")}
                  </button>
                ),
              )}
            </div>
            {tr(
              form && (
                <form className={"seller-inline-form"} onSubmit={save}>
                  <label>
                    {tr("Имя")}
                    <input name={"name"} required={true} minLength={2} maxLength={160} />
                  </label>
                  <label>
                    {tr("Email")}
                    <input name={"email"} type={"email"} required={true} />
                  </label>
                  <label>
                    {tr("Заметка")}
                    <textarea name={"note"} maxLength={2000} />
                  </label>
                  <button className={"platform-primary"} disabled={busy}>
                    {tr(busy ? "Сохраняем\u2026" : "Сохранить")}
                  </button>
                </form>
              ),
            )}
            {tr(
              leads.data.length ? (
                <div className={"seller-table-scroll"}>
                  <table className={"seller-table"}>
                    <thead>
                      <tr>
                        <th>{tr("Контакт")}</th>
                        <th>{tr("Email")}</th>
                        <th>{tr("Заметка")}</th>
                        <th>{tr("Этап")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tr(
                        leads.data.map((l) => (
                          <tr key={l.id}>
                            <td>{tr(l.name)}</td>
                            <td>{tr(l.email)}</td>
                            <td>{tr(l.note || "\u2014")}</td>
                            <td>
                              <select
                                disabled={!editable || busy}
                                aria-label={tr(`Этап ${l.name}`)}
                                value={l.status}
                                onChange={(e) => update(l.id, e.target.value)}
                              >
                                {tr(
                                  Object.entries(statuses).map(([k, v]) => (
                                    <option value={k} key={k}>
                                      {tr(v)}
                                    </option>
                                  )),
                                )}
                              </select>
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  title={tr("Контакты ещё не добавлены")}
                  description={"Здесь можно вести обращения, которые пришли по почте или телефону."}
                />
              ),
            )}
          </section>
        ),
      )}
    </>
  );
}
