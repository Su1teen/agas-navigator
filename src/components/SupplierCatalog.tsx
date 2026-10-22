// localized-ui
import { tr, useUi } from "@/lib/ui";
import { useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { API, api, money, useResource, type CatalogItem } from "@/lib/platform";
import { Heading, Empty, Loading, ErrorNotice, useSession } from "./Workspace";
const columns = {
  sku: "Артикул",
  category: "Категория",
  price: "Цена",
  stock: "Остаток",
  iso: "ISO / сертификат",
  invoiceRef: "Документ поставки",
};
export function SupplierCatalog() {
  useUi();
  useUi();
  const { data, error, loading, reload } = useResource<CatalogItem[]>("/supplier/products", []);
  const user = useSession(),
    editable = ["owner", "editor"].includes(user.role);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [sort, setSort] = useState("name"),
    [visible, setVisible] = useState<string[]>(Object.keys(columns)),
    [columnPanel, setColumnPanel] = useState(false),
    [edit, setEdit] = useState<CatalogItem | true | null>(null),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [failure, setFailure] = useState(""),
    [page, setPage] = useState(0);
  const filtered = useMemo(
    () =>
      data
        .filter(
          (p) =>
            (!category || p.category === category) &&
            `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "price"
            ? a.price_minor - b.price_minor
            : sort === "stock"
              ? a.stock - b.stock
              : a.name.localeCompare(b.name, "ru"),
        ),
    [data, search, category, sort],
  );
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setFailure("");
    try {
      await api("/supplier/products", {
        method: "POST",
        body: JSON.stringify({
          ...Object.fromEntries(
            [
              "sku",
              "name",
              "category",
              "description",
              "brand",
              "image",
              "iso",
              "document",
              "invoiceRef",
            ].map((k) => [k, String(f.get(k) || "")]),
          ),
          price: Number(f.get("price")),
          stock: Number(f.get("stock")),
        }),
      });
      setNotice("Товар сохранён");
      setEdit(null);
      reload();
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function publish(p: CatalogItem) {
    setFailure("");
    setBusy(true);
    try {
      await api(`/supplier/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !p.published }),
      });
      setNotice(p.published ? "Товар скрыт с витрины" : "Товар опубликован");
      reload();
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const p = edit && edit !== true ? edit : null;
  return (
    <>
      <Heading
        eyebrow={"КАТАЛОГ КОМПАНИИ"}
        title={tr("Товары")}
        description={"Управляйте ассортиментом, ценами и доступностью на маркетплейсе."}
        actions={
          <>
            <a className={"platform-secondary"} href={`${API}/api/supplier/export`}>
              <Download size={17} />
              {tr("Экспорт Excel")}
            </a>
            {tr(
              editable && (
                <button
                  className={"platform-primary"}
                  onClick={() => {
                    setEdit(true);
                    setFailure("");
                  }}
                >
                  <Plus size={17} />
                  {tr("Добавить товар")}
                </button>
              ),
            )}
          </>
        }
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
      <section className={"platform-panel seller-table-panel"}>
        <div className={"seller-table-toolbar"}>
          <label className={"seller-search"}>
            <Search size={18} />
            <input
              placeholder={tr("Название или артикул")}
              aria-label={tr("Поиск товаров")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </label>
          <select
            aria-label={tr("Категория")}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value={""}>{tr("Все категории")}</option>
            {tr(
              [...new Set(data.map((p) => p.category))].map((c) => (
                <option key={c}>{tr(c)}</option>
              )),
            )}
          </select>
          <select
            aria-label={tr("Сортировка")}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value={"name"}>{tr("По названию")}</option>
            <option value={"price"}>{tr("По цене")}</option>
            <option value={"stock"}>{tr("По остатку")}</option>
          </select>
          <button className={"platform-secondary"} onClick={() => setColumnPanel(!columnPanel)}>
            <SlidersHorizontal size={16} />
            {tr("Колонки")}
          </button>
        </div>
        {tr(
          columnPanel && (
            <div className={"seller-column-picker"}>
              {tr(
                Object.entries(columns).map(([k, v]) => (
                  <label key={k}>
                    <input
                      type={"checkbox"}
                      checked={visible.includes(k)}
                      onChange={() =>
                        setVisible((old) =>
                          old.includes(k) ? old.filter((v) => v !== k) : [...old, k],
                        )
                      }
                    />
                    {tr(v)}
                  </label>
                )),
              )}
            </div>
          ),
        )}
        {tr(
          loading ? (
            <Loading />
          ) : filtered.length ? (
            <>
              <div className={"seller-table-scroll"}>
                <table className={"seller-table"}>
                  <thead>
                    <tr>
                      <th>{tr("Товар")}</th>
                      {tr(
                        Object.entries(columns)
                          .filter(([k]) => visible.includes(k))
                          .map(([k, v]) => <th key={k}>{tr(v)}</th>),
                      )}
                      <th>{tr("На витрине")}</th>
                      {tr(editable && <th>{tr("Действия")}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tr(
                      filtered.slice(page * 30, page * 30 + 30).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className={"seller-product-name"}>
                              {tr(
                                p.image ? (
                                  <img
                                    src={p.image}
                                    alt={tr("")}
                                    referrerPolicy={"no-referrer"}
                                    loading={"lazy"}
                                  />
                                ) : (
                                  <span className={"seller-product-placeholder"}>{tr("A")}</span>
                                ),
                              )}
                              <span>
                                <strong>{tr(p.name)}</strong>
                                <small>{tr(p.brand || "Без бренда")}</small>
                              </span>
                            </div>
                          </td>
                          {tr(visible.includes("sku") && <td>{tr(p.sku)}</td>)}
                          {tr(visible.includes("category") && <td>{tr(p.category)}</td>)}
                          {tr(
                            visible.includes("price") && (
                              <td className={"seller-nowrap"}>{tr(money(p.price_minor))}</td>
                            ),
                          )}
                          {tr(
                            visible.includes("stock") && (
                              <td>
                                <span className={p.stock < 5 ? "seller-stock-low" : ""}>
                                  {tr(p.stock)}
                                  {tr(" шт.")}
                                </span>
                              </td>
                            ),
                          )}
                          {tr(
                            visible.includes("iso") && (
                              <td>
                                {tr(p.iso || "\u2014")}
                                {tr(
                                  p.document && (
                                    <a
                                      href={p.document}
                                      target={"_blank"}
                                      rel={"noreferrer"}
                                      className={"platform-link"}
                                    >
                                      {tr("Документ \u2197")}
                                    </a>
                                  ),
                                )}
                              </td>
                            ),
                          )}
                          {tr(
                            visible.includes("invoiceRef") && (
                              <td>{tr(p.invoiceRef || "\u2014")}</td>
                            ),
                          )}
                          <td>
                            <span
                              className={p.published ? "seller-status-green" : "platform-badge"}
                            >
                              {tr(p.published ? "Опубликован" : "Скрыт")}
                            </span>
                          </td>
                          {tr(
                            editable && (
                              <td>
                                <div className={"seller-row-actions"}>
                                  <button
                                    className={"platform-link"}
                                    onClick={() => {
                                      setEdit(p);
                                      setFailure("");
                                    }}
                                  >
                                    {tr("Изменить")}
                                  </button>
                                  <button
                                    className={"platform-link"}
                                    disabled={busy}
                                    onClick={() => publish(p)}
                                  >
                                    {tr(p.published ? "Скрыть" : "Опубликовать")}
                                  </button>
                                </div>
                              </td>
                            ),
                          )}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
              <div className={"seller-pagination"}>
                <span>
                  {tr(filtered.length)}
                  {tr(" товаров")}
                </span>
                <button disabled={page === 0} onClick={() => setPage((v) => v - 1)}>
                  {tr("\u2190 Назад")}
                </button>
                <span>
                  {tr(page + 1)}
                  {tr(" / ")}
                  {tr(Math.ceil(filtered.length / 30))}
                </span>
                <button
                  disabled={(page + 1) * 30 >= filtered.length}
                  onClick={() => setPage((v) => v + 1)}
                >
                  {tr("Далее \u2192")}
                </button>
              </div>
            </>
          ) : (
            <Empty
              title={tr(data.length ? "Ничего не найдено" : "Ассортимент начинается здесь")}
              description={
                data.length
                  ? "Попробуйте другой запрос или категорию."
                  : "Загрузите Excel или добавьте первый товар вручную."
              }
              action={
                editable && (
                  <Link to={"/upload"} className={"platform-primary"}>
                    {tr("Импортировать товары")}
                  </Link>
                )
              }
            />
          ),
        )}
      </section>
      {tr(
        edit && (
          <div className={"seller-modal-backdrop"}>
            <section
              className={"seller-modal"}
              role={"dialog"}
              aria-modal={"true"}
              aria-label={tr("Карточка товара")}
            >
              <button
                className={"seller-modal-close"}
                aria-label={tr("Закрыть")}
                onClick={() => setEdit(null)}
              >
                <X />
              </button>
              <h2>{tr(p ? "Изменить товар" : "Новый товар")}</h2>
              <p>
                {tr(
                  "Артикул определяет товар внутри вашей компании. Повторное сохранение обновит существующую позицию.",
                )}
              </p>
              {tr(failure && <ErrorNotice message={failure} />)}
              <form onSubmit={save}>
                <div className={"invoice-fields"}>
                  {tr(
                    [
                      ["sku", "Артикул", p?.sku],
                      ["name", "Название", p?.name],
                      ["category", "Категория", p?.category],
                      ["brand", "Бренд", p?.brand],
                      ["price", "Цена, KZT", p ? p.price_minor / 100 : ""],
                      ["stock", "Остаток", p?.stock ?? 0],
                      [
                        "image",
                        "Изображение, HTTPS URL",
                        p?.image?.startsWith("data:") ? "" : p?.image,
                      ],
                      ["iso", "ISO / сертификат", p?.iso],
                      ["document", "Ссылка на документ", p?.document],
                      ["invoiceRef", "Номер документа поставки", p?.invoiceRef],
                    ].map(([k, l, v]) => (
                      <label key={String(k)}>
                        {tr(l)}
                        <input
                          name={String(k)}
                          defaultValue={v ?? ""}
                          required={["sku", "name", "category", "price", "stock"].includes(
                            String(k),
                          )}
                          readOnly={k === "sku" && Boolean(p)}
                          type={["price", "stock"].includes(String(k)) ? "number" : "text"}
                          min={k === "price" ? 0.01 : 0}
                          step={k === "price" ? 0.01 : 1}
                        />
                      </label>
                    )),
                  )}
                  <label className={"invoice-wide"}>
                    {tr("Описание")}
                    <textarea name={"description"} defaultValue={p?.description} maxLength={4000} />
                  </label>
                </div>
                <button className={"platform-primary"} disabled={busy}>
                  {tr(busy ? "Сохраняем\u2026" : "Сохранить товар")}
                </button>
              </form>
            </section>
          </div>
        ),
      )}
    </>
  );
}
