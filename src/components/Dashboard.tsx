// localized-ui
import { Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PackageSearch, Sparkles } from "lucide-react";
import { useResource, money, type CatalogItem } from "@/lib/platform";
import { useUi, tr } from "@/lib/ui";
import { Heading, Empty, Loading, ErrorNotice, useSession } from "./Workspace";
type Analytics = {
  products: number;
  published: number;
  lowStock: number;
  orders: number;
  invoicedMinor: number;
  categories: Record<string, number>;
  series: {
    month: string;
    totalMinor: number;
    orders: number;
  }[];
};
export function Dashboard() {
  useUi();
  const user = useSession(),
    { lang } = useUi(),
    stats = useResource<Analytics | null>("/supplier/analytics", null),
    products = useResource<CatalogItem[]>("/supplier/products", []),
    data = stats.data;
  const series =
    data?.series?.map((s) => ({
      ...s,
      label: new Date(s.month + "-01T12:00:00Z").toLocaleDateString(
        lang === "ru" ? "ru-RU" : "en-US",
        { month: "short" },
      ),
    })) || [];
  const categories = Object.entries(data?.categories || {}).map(([name, count]) => ({
    name,
    count,
  }));
  return (
    <>
      <Heading
        title={tr("Обзор для руководства")}
        description={`Сводные показатели компании ${user.supplierName}.`}
      />
      {tr(
        stats.error ? (
          <ErrorNotice message={stats.error} retry={stats.reload} />
        ) : stats.loading ? (
          <Loading />
        ) : (
          data && (
            <>
              <div className="seller-kpis">
                {tr(
                  [
                    ["Товаров в каталоге", String(data.products), "Включая скрытые позиции"],
                    ["Опубликовано", String(data.published), "Доступны покупателям"],
                    ["Заказов со счётом", String(data.orders), "Ожидают оплаты"],
                    ["Сумма по счетам", money(data.invoicedMinor), "Не является выручкой"],
                  ].map(([label, value, note]) => (
                    <section className="glass seller-kpi" key={label}>
                      <span>{tr(tr(label))}</span>
                      <strong>{tr(value)}</strong>
                      <small>{tr(tr(note))}</small>
                    </section>
                  )),
                )}
              </div>
              <div className="seller-chart-grid">
                <section className="glass platform-panel">
                  <div className="seller-chart-heading">
                    <h2>{tr("Заказы и счета")}</h2>
                    <span>{tr("Последние 12 месяцев")}</span>
                  </div>
                  {tr(
                    data.orders ? (
                      <div className="seller-chart">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={series}>
                            <CartesianGrid stroke="#e3e7eb" vertical={false} />
                            <XAxis
                              dataKey="label"
                              fontSize={11}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              width={90}
                              fontSize={10}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => money(v)}
                            />
                            <Tooltip formatter={(v: number) => money(v)} />
                            <Area
                              isAnimationActive={false}
                              dataKey="totalMinor"
                              name={tr("Сумма по счетам")}
                              type="monotone"
                              stroke="#315b80"
                              strokeWidth={2}
                              fill="#315b8020"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <Empty
                        title={tr("Заказов пока нет")}
                        description="График появится после формирования первых счетов с вашими товарами."
                      />
                    ),
                  )}
                  <p className="seller-chart-note">
                    {tr(
                      "Учитываются только сохранённые счета. Подтверждённые платежи не поступают в систему.",
                    )}
                  </p>
                </section>
                <section className="glass platform-panel">
                  <div className="seller-chart-heading">
                    <h2>{tr("Товары по категориям")}</h2>
                  </div>
                  {tr(
                    categories.length ? (
                      <div className="seller-chart">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categories} layout="vertical">
                            <CartesianGrid horizontal={false} stroke="#e3e7eb" />
                            <XAxis type="number" allowDecimals={false} fontSize={11} />
                            <YAxis type="category" dataKey="name" width={100} fontSize={11} />
                            <Tooltip />
                            <Bar
                              isAnimationActive={false}
                              dataKey="count"
                              name={tr("Товары")}
                              fill="#315b80"
                              radius={[0, 6, 6, 0]}
                              maxBarSize={34}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <Empty
                        title={tr("Категории появятся здесь")}
                        description="Добавьте товары вручную или загрузите таблицу."
                      />
                    ),
                  )}
                </section>
              </div>
              <div className="seller-two-columns">
                <section className="glass platform-panel">
                  <h2 className="seller-icon-heading">
                    <PackageSearch size={18} />
                    {tr("Требуется пополнение")}
                  </h2>
                  {tr(
                    products.data.some((p) => p.stock < 5) ? (
                      products.data
                        .filter((p) => p.stock < 5)
                        .slice(0, 8)
                        .map((p) => (
                          <div key={p.id} className="invoice-line">
                            <div>
                              <strong>{tr(p.name)}</strong>
                              <small>
                                {tr(p.sku)} · {tr(p.stock)} {tr(tr("шт."))}
                              </small>
                            </div>
                            <span className="platform-badge">
                              {tr(tr(p.stock === 0 ? "Нет в наличии" : "Мало"))}
                            </span>
                          </div>
                        ))
                    ) : (
                      <p className="seller-empty-inline">{tr("Товаров с низким остатком нет.")}</p>
                    ),
                  )}
                  <Link to="/catalog" className="platform-link">
                    {tr("Проверить каталог \u2192")}
                  </Link>
                </section>
                <section className="glass platform-panel">
                  <h2 className="seller-icon-heading">
                    <Sparkles size={18} />
                    {tr("Рекомендации")}
                  </h2>
                  <div className="seller-insight">
                    {tr(
                      "Загрузите ассортимент в Excel, сопоставьте колонки и проверьте данные перед публикацией.",
                    )}
                  </div>
                  <div className="seller-insight">
                    {tr(
                      "Счёт не подтверждает оплату. Сумма по счетам отображается отдельно от выручки.",
                    )}
                  </div>
                  <div className="seller-insight">
                    {tr(
                      "Регулярно обновляйте цены и остатки. Повторный импорт обновляет товары по артикулу.",
                    )}
                  </div>
                </section>
              </div>
            </>
          )
        ),
      )}
    </>
  );
}
