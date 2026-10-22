// localized-ui
import { tr, useUi } from "@/lib/ui";
import { useState, type FormEvent } from "react";
import { api, useResource } from "@/lib/platform";
import { Heading, Loading, ErrorNotice, useSession } from "./Workspace";
type Profile = {
  supplier: {
    id: string;
    name: string;
  };
  members: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
};
const roles: Record<string, string> = {
  owner: "Владелец",
  editor: "Редактор каталога",
  analyst: "Аналитик",
};
export function CompanyWorkspace() {
  useUi();
  useUi();
  const user = useSession(),
    { data, error, loading, reload } = useResource<Profile | null>("/supplier/profile", null);
  const [failure, setFailure] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setFailure("");
    const form = e.currentTarget;
    try {
      await api("/supplier/team", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      setNotice("Сотрудник добавлен. Передайте ему доступ по защищённому каналу.");
      form.reset();
      reload();
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow={"НАСТРОЙКИ КОМПАНИИ"}
        title={tr("Компания и команда")}
        description={"Каждый сотрудник работает только с данными своей компании."}
      />
      {tr(
        (error || failure) && (
          <ErrorNotice message={failure || error} retry={error ? reload : void 0} />
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
        loading ? (
          <Loading />
        ) : (
          data && (
            <>
              <div className={"seller-two-columns"}>
                <section className={"platform-panel"}>
                  <h2>{tr(data.supplier.name)}</h2>
                  <dl className={"invoice-details"}>
                    <div>
                      <dt>{tr("Ваша роль")}</dt>
                      <dd>{tr(roles[user.role] || user.role)}</dd>
                    </div>
                    <div>
                      <dt>{tr("Валюта")}</dt>
                      <dd>{tr("Казахстанский тенге \u00B7 KZT")}</dd>
                    </div>
                    <div>
                      <dt>{tr("Поставщик")}</dt>
                      <dd>{tr(data.supplier.id)}</dd>
                    </div>
                  </dl>
                  <div className={"seller-help"}>
                    <strong>{tr("Данные сохраняются на сервере")}</strong>
                    <p>
                      {tr(
                        "Товары публикуются на общей витрине AGAS. Счета покупателей доступны владельцам этих счетов; поставщик видит только свои строки заказов.",
                      )}
                    </p>
                  </div>
                </section>
                <section className={"platform-panel"}>
                  <h2>{tr("Команда")}</h2>
                  {tr(
                    data.members.map((m) => (
                      <div className={"seller-team-member"} key={m.id}>
                        <span>{tr(m.name.slice(0, 1))}</span>
                        <div>
                          <strong>{tr(m.name)}</strong>
                          <small>{tr(m.email)}</small>
                        </div>
                        <b>{tr(roles[m.role])}</b>
                      </div>
                    )),
                  )}
                </section>
              </div>
              {tr(
                user.role === "owner" && (
                  <section className={"platform-panel seller-team-form"}>
                    <h2>{tr("Добавить сотрудника")}</h2>
                    <p>
                      {tr(
                        "Редактор управляет товарами, импортом и CRM. Аналитик может просматривать данные и выгружать отчёты.",
                      )}
                    </p>
                    <form className={"seller-inline-form"} onSubmit={add}>
                      <label>
                        {tr("Имя")}
                        <input name={"name"} required={true} minLength={2} maxLength={120} />
                      </label>
                      <label>
                        {tr("Email")}
                        <input type={"email"} name={"email"} required={true} />
                      </label>
                      <label>
                        {tr("Начальный пароль")}
                        <input
                          name={"password"}
                          type={"password"}
                          required={true}
                          minLength={12}
                          maxLength={128}
                          autoComplete={"new-password"}
                        />
                      </label>
                      <label>
                        {tr("Роль")}
                        <select name={"role"}>
                          <option value={"editor"}>{tr("Редактор каталога")}</option>
                          <option value={"analyst"}>{tr("Аналитик")}</option>
                        </select>
                      </label>
                      <button className={"platform-primary"} disabled={busy}>
                        {tr(busy ? "Сохраняем\u2026" : "Добавить сотрудника")}
                      </button>
                    </form>
                  </section>
                ),
              )}
            </>
          )
        ),
      )}
    </>
  );
}
