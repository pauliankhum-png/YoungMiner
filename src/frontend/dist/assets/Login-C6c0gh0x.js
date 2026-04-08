import { u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports } from "./index-DoJZ7Rh2.js";
import { C as Cpu, Z as Zap, B as Button } from "./zap-CrsmBaJ1.js";
function ParticleCanvas() {
  const canvasRef = reactExports.useRef(null);
  const animRef = reactExports.useRef(0);
  const particlesRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? "green" : "blue"
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = p.opacity;
        const color = p.color === "green" ? `oklch(0.75 0.2 120 / ${alpha})` : `oklch(0.70 0.15 220 / ${alpha})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 pointer-events-none",
      tabIndex: -1
    }
  );
}
function Login() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  reactExports.useEffect(() => {
    if (identity) {
      window.location.replace("/");
    }
  }, [identity]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background grid-bg flex flex-col items-center justify-center overflow-hidden p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none z-10",
        style: {
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)"
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl",
        style: { background: "oklch(0.75 0.27 120 / 0.08)" },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none blur-3xl",
        style: { background: "oklch(0.65 0.21 220 / 0.07)" },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleCanvas, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-accent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-accent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-accent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-accent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/80 backdrop-blur-md border border-border glow-neon-green rounded-sm p-8 flex flex-col items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-sm border border-accent/40 bg-background flex items-center justify-center animate-pulse-glow",
              "data-ocid": "login-logo-icon",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-8 h-8 text-glow-accent", strokeWidth: 1.5 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Zap,
            {
              className: "absolute -top-2 -right-2 w-4 h-4 text-glow-accent",
              strokeWidth: 2,
              "aria-hidden": "true"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              className: "font-mono text-3xl font-bold tracking-widest uppercase text-glow-accent",
              "data-ocid": "login-title",
              children: "CryptoMiner"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground tracking-widest uppercase leading-relaxed", children: [
            "Mine coins. Upgrade your rig.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Dominate the chain."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground tracking-widest", children: "AUTHENTICATE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => login(),
            disabled: isLoggingIn,
            className: "w-full font-mono tracking-widest uppercase text-sm h-12 border border-accent/60 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent hover:shadow-neon-glow transition-smooth disabled:opacity-60",
            "data-ocid": "login-identity-btn",
            "aria-busy": isLoggingIn,
            children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" }),
              "Authenticating..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
              "Connect with Internet Identity"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground text-center leading-relaxed", children: [
          "Secured by",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-glow-primary", children: "Internet Identity" }),
          ".",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Your progress is stored on-chain."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative z-20 mt-10 text-xs font-mono text-muted-foreground text-center", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-accent transition-colors duration-200",
          children: "Built with love using caffeine.ai"
        }
      )
    ] })
  ] });
}
export {
  Login as default
};
