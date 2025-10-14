import { AppShell } from "@/components/layout";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Customize your preferences and manage your account settings.
          </p>
        </div>
        
        {/* Placeholder content - será implementado */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Settings and profile management features are in development.
          </p>
        </div>
      </div>
    </AppShell>
  );
}