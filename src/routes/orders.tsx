// localized-ui
import { tr, useUi } from "@/lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";
import { OrdersWorkspace } from "@/components/OrdersWorkspace";
export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Заказы и CRM · AGAS Поставщикам" }] }),
  component: () => (
    <Workspace>
      <OrdersWorkspace />
    </Workspace>
  ),
});
