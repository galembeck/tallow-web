import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_system/settings/")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Configurações | Terra & Tallow" }],
  }),
});

function SettingsPage() {
  return <div>Hello "/admin/_system/settings/"!</div>;
}
