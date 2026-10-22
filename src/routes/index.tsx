// localized-ui
import { tr, useUi } from "@/lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";
import { Dashboard } from "@/components/Dashboard";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Обзор · AGAS Поставщикам" }] }),
  component: () => (
    <Workspace>
      <Dashboard />
    </Workspace>
  ),
});
