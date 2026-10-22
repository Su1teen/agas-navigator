// localized-ui
import { tr, useUi } from "@/lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";
import { SupplierCatalog } from "@/components/SupplierCatalog";
export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [{ title: "Товары · AGAS Поставщикам" }] }),
  component: () => (
    <Workspace>
      <SupplierCatalog />
    </Workspace>
  ),
});
