// localized-ui
import { tr, useUi } from "@/lib/ui";
import { useState, useRef, type ChangeEvent } from "react";
import { Download, UploadCloud, CheckCircle2, ArrowRight, FileSpreadsheet } from "lucide-react";
import { API, api, useResource } from "@/lib/platform";
import { Heading, ErrorNotice, Empty, useSession } from "./Workspace";
const fields: Record<string, string> = {
  sku: "Артикул",
  name: "Название",
  category: "Категория",
  description: "Описание",
  brand: "Бренд",
  price: "Цена, KZT",
  stock: "Остаток",
  image: "Изображение",
  iso: "ISO / сертификат",
  document: "Документ, URL",
  invoiceRef: "Номер документа поставки",
};
const aliases: Record<string, string[]> = {
  sku: ["sku", "артикул", "код", "артикулпоставщика"],
  name: ["название", "наименование", "товар", "productname", "name"],
  category: ["категория", "category"],
  price: ["ценакzt", "ценаkzt", "цена", "price", "стоимость"],
  stock: ["остаток", "stock", "количество", "quantity"],
  image: ["изображение", "фото", "image", "url", "изображениеurl"],
  description: ["описание", "description"],
  brand: ["бренд", "brand"],
  iso: ["isoсертификат", "сертификат", "iso"],
  document: ["документurl", "документ", "сертификатurl"],
  invoiceRef: ["номердокументапоставки", "счетфактура", "накладная"],
};
const normalize = (s: string) => s.toLowerCase().replace(/[^a-zа-яё0-9]/g, "");
type Preview = {
  id: string;
  headers: string[];
  rows: string[][];
  sheets: string[];
  sheetIndex: number;
  imageRows: string[];
};
type Validation = {
  row: number;
  value: {
    sku: string;
    name: string;
    image: string;
  } | null;
  errors: string[];
};
type Report = {
  created: number;
  updated: number;
  skipped: number;
  total: number;
  rows: {
    row: number;
    sku: string;
    status: string;
    errors: string;
  }[];
};
type History = {
  id: string;
  file_name: string;
  created_at: string;
  report: Report;
};
export function ImportWorkspace() {
  useUi();
  useUi();
  const user = useSession();
  const editable = ["owner", "editor"].includes(user.role);
  const [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<Preview | null>(null),
    [mapping, setMapping] = useState<Record<string, string>>({}),
    [validation, setValidation] = useState<Validation[] | null>(null),
    [report, setReport] = useState<Report | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [partial, setPartial] = useState(false),
    [page, setPage] = useState(0),
    [errorsOnly, setErrorsOnly] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const history = useResource<History[]>("/supplier/imports", []);
  async function upload(f: File, sheet = 0) {
    setBusy(true);
    setError("");
    setReport(null);
    setValidation(null);
    setPreview(null);
    setPartial(false);
    const body = new FormData();
    body.append("file", f);
    body.append("sheet", String(sheet));
    try {
      const result = await api<Preview>("/supplier/imports/preview", { method: "POST", body });
      setPreview(result);
      const used = new Set();
      setMapping(
        Object.fromEntries(
          result.headers.map((h, i) => {
            const field =
              Object.keys(aliases).find(
                (k) => aliases[k]!.includes(normalize(h)) && !used.has(k),
              ) || "";
            if (field) used.add(field);
            return [String(i), field];
          }),
        ),
      );
      setPage(0);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function choose(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      void upload(f);
    }
    e.target.value = "";
  }
  async function validate() {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      setValidation(
        await api<Validation[]>(`/supplier/imports/${preview.id}/validate`, {
          method: "POST",
          body: JSON.stringify({ mapping, allowPartial: partial }),
        }),
      );
      setPage(0);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function commit() {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      setReport(
        await api<Report>(`/supplier/imports/${preview.id}/commit`, {
          method: "POST",
          body: JSON.stringify({ mapping, allowPartial: partial }),
        }),
      );
      history.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const invalid = validation?.filter((v) => v.errors.length).length || 0;
  const rows =
    preview?.rows
      .map((row, i) => ({ row, number: i + 2, check: validation?.[i] }))
      .filter((r) => !errorsOnly || r.check?.errors.length) || [];
  return (
    <>
      <Heading
        eyebrow={"МАССОВОЕ ДОБАВЛЕНИЕ"}
        title={tr("Из таблицы \u2014 в каталог")}
        description={
          "Загрузите ассортимент в своём формате. Назначьте колонки, проверьте данные и опубликуйте товары."
        }
        actions={
          <a className={"platform-secondary"} href={`${API}/api/supplier/template`}>
            <Download size={17} />
            {tr("Скачать шаблон")}
          </a>
        }
      />
      <ol className={"seller-import-steps"}>
        {tr(
          ["Файл и лист", "Колонки и проверка", "Публикация и отчёт"].map((t, i) => (
            <li
              data-active={report ? true : validation ? i < 2 : preview ? i < 2 : i === 0}
              key={t}
            >
              <span>{tr(i + 1)}</span>
              {tr(t)}
            </li>
          )),
        )}
      </ol>
      {tr(error && <ErrorNotice message={error} />)}
      {tr(" ")}
      {tr(
        !editable ? (
          <ErrorNotice
            message={
              "Ваша роль позволяет просматривать данные. Для импорта обратитесь к владельцу компании."
            }
          />
        ) : (
          <>
            {tr(
              !report && (
                <section
                  className={"seller-upload"}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f && !busy) {
                      setFile(f);
                      upload(f);
                    }
                  }}
                >
                  <div className={"seller-upload-icon"}>
                    <UploadCloud size={28} />
                  </div>
                  <h2>
                    {tr(
                      busy
                        ? "Обрабатываем файл\u2026"
                        : file
                          ? file.name
                          : "Перетащите таблицу сюда",
                    )}
                  </h2>
                  <p>{tr("Excel XLSX или CSV в UTF-8 \u00B7 до 10 МБ \u00B7 до 5 000 товаров")}</p>
                  <button
                    className={"platform-primary"}
                    disabled={busy}
                    onClick={() => input.current?.click()}
                  >
                    {tr(file ? "Выбрать другой файл" : "Выбрать файл")}
                  </button>
                  <input
                    ref={input}
                    type={"file"}
                    accept={".xlsx,.csv"}
                    hidden={true}
                    onChange={choose}
                    aria-label={tr("Загрузить таблицу")}
                  />
                  <small>
                    {tr("Товары появятся на витрине только после вашей проверки и публикации.")}
                  </small>
                </section>
              ),
            )}
            {tr(
              preview && !report && (
                <>
                  <section className={"platform-panel"}>
                    <div className={"seller-section-heading"}>
                      <div>
                        <h2>{tr("Назначьте поля колонкам")}</h2>
                        <p>
                          {tr(
                            "Не нужные в каталоге колонки оставьте с назначением \u00ABПропустить\u00BB.",
                          )}
                        </p>
                      </div>
                      <label>
                        {tr("Лист")}
                        {tr(" ")}
                        <select
                          disabled={busy}
                          value={preview.sheetIndex}
                          onChange={(e) => file && upload(file, Number(e.target.value))}
                        >
                          {tr(
                            preview.sheets.map((s, i) => (
                              <option value={i} key={i}>
                                {tr(s)}
                              </option>
                            )),
                          )}
                        </select>
                      </label>
                    </div>
                    <div className={"seller-mapping"}>
                      {tr(
                        preview.headers.map((h, i) => (
                          <label key={i}>
                            <strong title={tr(h)}>{tr(h)}</strong>
                            <span>
                              {tr("Например: ")}
                              {tr(preview.rows[0]?.[i]?.slice(0, 80) || "пусто")}
                            </span>
                            <select
                              aria-label={tr(`Назначение колонки ${h}`)}
                              value={mapping[i] || ""}
                              disabled={busy}
                              onChange={(e) => {
                                setMapping((m) => ({
                                  ...m,
                                  [i]: e.target.value,
                                }));
                                setValidation(null);
                                setErrorsOnly(false);
                              }}
                            >
                              <option value={""}>{tr("Пропустить")}</option>
                              {tr(
                                Object.entries(fields).map(([k, v]) => (
                                  <option value={k} key={k}>
                                    {tr(v)}
                                    {tr(
                                      ["sku", "name", "category", "price", "stock"].includes(k)
                                        ? " *"
                                        : "",
                                    )}
                                  </option>
                                )),
                              )}
                            </select>
                          </label>
                        )),
                      )}
                    </div>
                    <p className={"seller-info"}>
                      {tr(
                        "Обязательные поля: артикул, название, категория, цена и остаток. Цена \u2014 в KZT, без обозначения валюты. Встроенные фото распознаны в ",
                      )}
                      {tr(preview.imageRows.length)}
                      {tr(" ")}
                      {tr("строках.")}
                    </p>
                    <button className={"platform-primary"} onClick={validate} disabled={busy}>
                      {tr(busy ? "Проверяем\u2026" : "Проверить данные")}
                      <ArrowRight size={16} />
                    </button>
                  </section>
                  <section className={"platform-panel seller-table-panel"}>
                    <div className={"seller-section-heading"}>
                      <div>
                        <h2>
                          {tr("Предпросмотр \u00B7 ")}
                          {tr(preview.rows.length)}
                          {tr(" строк")}
                        </h2>
                        <p>
                          {tr(
                            validation
                              ? `${validation.length - invalid} корректных · ${invalid} с ошибками`
                              : "Назначьте поля и запустите проверку",
                          )}
                        </p>
                      </div>
                      {tr(
                        validation && (
                          <label>
                            <input
                              type={"checkbox"}
                              checked={errorsOnly}
                              onChange={(e) => {
                                setErrorsOnly(e.target.checked);
                                setPage(0);
                              }}
                            />
                            {tr(" ")}
                            {tr("Только ошибки")}
                          </label>
                        ),
                      )}
                    </div>
                    <div className={"seller-table-scroll"}>
                      <table className={"seller-table"}>
                        <thead>
                          <tr>
                            <th>{tr("Строка")}</th>
                            {tr(
                              preview.headers.map((h, i) => (
                                <th className={!mapping[i] ? "seller-ignored" : ""} key={i}>
                                  {tr(h)}
                                  <small>{tr(fields[mapping[i] || ""] || "Пропустить")}</small>
                                </th>
                              )),
                            )}
                            <th>{tr("Результат проверки")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tr(
                            rows.slice(page * 30, page * 30 + 30).map((r) => (
                              <tr
                                className={r.check?.errors.length ? "seller-invalid-row" : ""}
                                key={r.number}
                              >
                                <td>{tr(r.number)}</td>
                                {tr(
                                  preview.headers.map((h, i) => (
                                    <td className={!mapping[i] ? "seller-ignored" : ""} key={i}>
                                      {tr(
                                        mapping[i] === "image" &&
                                          /^https:\/\//.test(r.row[i] || "") ? (
                                          <img
                                            className={"seller-cell-image"}
                                            src={r.row[i]}
                                            alt={tr("Фото товара")}
                                            referrerPolicy={"no-referrer"}
                                            loading={"lazy"}
                                          />
                                        ) : (
                                          <span className={"seller-cell-text"} title={tr(r.row[i])}>
                                            {tr(r.row[i] || "\u2014")}
                                          </span>
                                        ),
                                      )}
                                    </td>
                                  )),
                                )}
                                <td>
                                  {tr(
                                    r.check ? (
                                      r.check.errors.length ? (
                                        <span className={"seller-row-error"}>
                                          {tr(r.check.errors.join("; "))}
                                        </span>
                                      ) : (
                                        <span className={"seller-status-green"}>
                                          {tr("Готово к публикации")}
                                        </span>
                                      )
                                    ) : (
                                      <span className={"text-muted-foreground"}>
                                        {tr("Не проверено")}
                                      </span>
                                    ),
                                  )}
                                </td>
                              </tr>
                            )),
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className={"seller-pagination"}>
                      <span>
                        {tr(rows.length)}
                        {tr(" строк")}
                      </span>
                      <button disabled={page === 0} onClick={() => setPage((v) => v - 1)}>
                        {tr("\u2190 Назад")}
                      </button>
                      <span>
                        {tr(page + 1)}
                        {tr(" / ")}
                        {tr(Math.max(1, Math.ceil(rows.length / 30)))}
                      </span>
                      <button
                        disabled={(page + 1) * 30 >= rows.length}
                        onClick={() => setPage((v) => v + 1)}
                      >
                        {tr("Далее \u2192")}
                      </button>
                    </div>
                  </section>
                  {tr(
                    validation && (
                      <section className={"seller-import-confirm"}>
                        <div>
                          <h2>
                            {tr(
                              invalid
                                ? "Проверьте строки с ошибками"
                                : "Данные готовы к публикации",
                            )}
                          </h2>
                          <p>
                            {tr(
                              invalid
                                ? "Исправьте исходный файл и загрузите заново либо явно разрешите пропуск ошибочных строк."
                                : "Товары с существующим артикулом будут обновлены. Остальные будут созданы.",
                            )}
                          </p>
                          {tr(
                            invalid > 0 && (
                              <label>
                                <input
                                  type={"checkbox"}
                                  checked={partial}
                                  onChange={(e) => setPartial(e.target.checked)}
                                />
                                {tr(" ")}
                                {tr("Пропустить ")}
                                {tr(invalid)}
                                {tr(" некорректных строк и сохранить остальные")}
                              </label>
                            ),
                          )}
                        </div>
                        <button
                          className={"platform-primary"}
                          disabled={
                            busy || (invalid > 0 && !partial) || invalid === validation.length
                          }
                          onClick={commit}
                        >
                          {tr(
                            busy
                              ? "Сохраняем\u2026"
                              : `Опубликовать ${validation.length - invalid} товаров`,
                          )}
                        </button>
                      </section>
                    ),
                  )}
                </>
              ),
            )}
            {tr(
              report && (
                <section className={"platform-panel seller-import-result"}>
                  <CheckCircle2 size={42} />
                  <h2>{tr("Каталог обновлён")}</h2>
                  <p>{tr("Изменения сохранены на сервере и доступны на маркетплейсе.")}</p>
                  <div className={"seller-report-stats"}>
                    {tr(
                      [
                        ["Создано", report.created],
                        ["Обновлено", report.updated],
                        ["Пропущено", report.skipped],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <strong>{tr(v)}</strong>
                          <span>{tr(l)}</span>
                        </div>
                      )),
                    )}
                  </div>
                  <div className={"platform-actions"}>
                    <a
                      className={"platform-primary"}
                      href={`${API}/api/supplier/imports/${preview?.id}/report`}
                    >
                      <Download size={17} />
                      {tr("Скачать отчёт Excel")}
                    </a>
                    <button
                      className={"platform-secondary"}
                      onClick={() => {
                        setReport(null);
                        setPreview(null);
                        setFile(null);
                      }}
                    >
                      {tr("Загрузить ещё файл")}
                    </button>
                  </div>
                  {tr(
                    report.skipped > 0 && (
                      <p className={"platform-error"}>
                        {tr("Пропущено ")}
                        {tr(report.skipped)}
                        {tr(" строк. Причины перечислены в отчёте.")}
                      </p>
                    ),
                  )}
                </section>
              ),
            )}
          </>
        ),
      )}
      <details className={"seller-import-rules"}>
        <summary>{tr("Изображения и документы: поддерживаемые форматы")}</summary>
        <p>
          {tr(
            "Изображение можно передать HTTPS-ссылкой, гиперссылкой ячейки или встроенным фото XLSX (PNG, JPEG, WebP), привязанным к строке товара. Одно фото на строку, до 2 МБ каждое и до 8 МБ на файл. Ссылка имеет приоритет над встроенным фото. Формулы IMAGE, макросы, старый XLS, SVG и плавающие фото без привязки к строке не поддерживаются. Сервер не скачивает внешние ссылки; доступность фото зависит от источника.",
          )}
        </p>
        <p>
          {tr(
            "ISO / сертификат, номер документа и URL документа сохраняются в карточке товара. Подлинность документов не подтверждается автоматически. Печати и подписи не генерируются.",
          )}
        </p>
      </details>
      <section className={"platform-panel seller-import-history"}>
        <h2>{tr("История загрузок")}</h2>
        {tr(
          history.error ? (
            <ErrorNotice message={history.error} retry={history.reload} />
          ) : history.data.length ? (
            <div className={"seller-table-scroll"}>
              <table className={"seller-table"}>
                <thead>
                  <tr>
                    <th>{tr("Файл")}</th>
                    <th>{tr("Дата")}</th>
                    <th>{tr("Создано / обновлено / пропущено")}</th>
                    <th>{tr("Отчёт")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tr(
                    history.data.map((h) => (
                      <tr key={h.id}>
                        <td>
                          <FileSpreadsheet size={16} />
                          {tr(h.file_name)}
                        </td>
                        <td>
                          {tr(
                            new Date(h.created_at.replace(" ", "T") + "Z").toLocaleString("ru-RU"),
                          )}
                        </td>
                        <td>
                          {tr(h.report.created)}
                          {tr(" / ")}
                          {tr(h.report.updated)}
                          {tr(" / ")}
                          {tr(h.report.skipped)}
                        </td>
                        <td>
                          <a
                            className={"platform-link"}
                            href={`${API}/api/supplier/imports/${h.id}/report`}
                          >
                            {tr("Скачать XLSX")}
                          </a>
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title={tr("Здесь будут ваши загрузки")}
              description={"После публикации сохранится история с результатами каждой строки."}
            />
          ),
        )}
      </section>
    </>
  );
}
