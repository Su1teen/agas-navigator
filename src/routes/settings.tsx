// localized-ui
import { tr, useUi } from "@/lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";
import { CompanyWorkspace } from "@/components/CompanyWorkspace";
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Компания и команда · AGAS Поставщикам" }] }),
  component: () => (
    <Workspace>
      <CompanyWorkspace />
    </Workspace>
  ),
});
