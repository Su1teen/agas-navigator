// localized-ui
import { tr, useUi } from "@/lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";
import { ImportWorkspace } from "@/components/ImportWorkspace";
export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Импорт Excel · AGAS Поставщикам" }] }),
  component: () => (
    <Workspace>
      <ImportWorkspace />
    </Workspace>
  ),
});
