import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/historia", label: "Historia" },
    { to: "/ayuda", label: "Ayudar" },
    { to: "/juego", label: "Juego" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-cocoa"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-butter text-cocoa shadow-sm">
            🐾
          </span>
          <span className="hidden sm:inline">Ayuda a Maylu</span>
          <span className="sm:hidden">Maylu</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold text-cocoa md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-butter text-cocoa" }}
              className="rounded-full px-3 py-1.5 transition hover:bg-butter/60"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-cocoa/20 bg-cream text-cocoa transition hover:bg-butter/60 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-cream/95 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3 text-sm font-semibold text-cocoa">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-butter text-cocoa" }}
                className="rounded-xl px-4 py-3 transition hover:bg-butter/60"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
