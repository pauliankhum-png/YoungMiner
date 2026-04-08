import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Cpu, LogOut, Zap } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background grid-bg">
      {/* Header */}
      <header className="bg-card border-b border-border/60 glow-neon-green px-4 py-3 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/40 flex items-center justify-center">
            <Cpu
              className="w-4 h-4 text-glow-accent"
              style={{ color: "oklch(var(--accent))" }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-mono font-bold tracking-widest uppercase text-glow-accent"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              NeonHash
            </span>
            <span
              className="text-xs font-mono text-muted-foreground tracking-wider uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Cyber-Miner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
            <Zap
              className="w-3 h-3"
              style={{ color: "oklch(var(--accent))" }}
            />
            <span
              className="text-xs font-mono text-glow-accent"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ONLINE
            </span>
          </div>

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              className="gap-2 text-muted-foreground hover:text-foreground transition-smooth"
              data-ocid="header-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span
                className="hidden sm:inline text-xs font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                LOGOUT
              </span>
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/40 px-4 py-3 text-center">
        <p
          className="text-xs font-mono text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-200"
            style={{ color: "inherit" }}
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
