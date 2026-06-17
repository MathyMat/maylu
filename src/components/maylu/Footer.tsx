import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export function Footer() {
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isPapa = (() => { try { return localStorage.getItem("isPapa") === "true"; } catch { return false; } })();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowInput(false);
        setPassword("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit() {
    if (password === (import.meta.env.VITE_PAPA_PASSWORD || "maylucatapeque123")) {
      try { localStorage.setItem("isPapa", "true"); } catch {}
      toast.success("👑 Modo papá activado", { duration: 2000 });
      setShowInput(false);
      setPassword("");
    } else {
      toast.error("Contraseña incorrecta", { duration: 2000 });
    }
  }

  return (
    <footer className="relative mt-20 border-t border-border/60 bg-butter/30">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-cocoa/80">
        <p className="font-display text-base text-cocoa">Hecho con 💛 para Maylu</p>
        <p className="mt-1">
          Cada chocoteja, cada compartida, cada oración cuenta. Gracias por estar.
        </p>
      </div>

      <div ref={wrapperRef} className="absolute bottom-2 right-4">
        <button type="button" onClick={() => { setShowInput(!showInput); setPassword(""); }}
          className={`grid h-8 w-8 place-items-center rounded-full text-sm transition ${isPapa ? "opacity-30 hover:opacity-100" : "opacity-20 hover:opacity-60"}`}
          title={isPapa ? "Modo papá activado 🦴" : "🦴"}>
          🦴
        </button>
        {showInput && (
          <div className="absolute bottom-full right-0 mb-2 flex gap-2 rounded-xl border-2 border-cocoa/20 bg-cream px-3 py-2 shadow-xl">
            <input ref={inputRef} type="password" placeholder="" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
              className="w-40 rounded-lg border-2 border-cocoa/20 bg-cream px-3 py-1.5 text-sm text-cocoa placeholder:text-cocoa/40 focus:border-honey focus:outline-none" autoFocus />
            <button type="button" onClick={handleSubmit}
              className="rounded-full bg-honey px-3 py-1 text-xs font-bold text-cocoa">OK</button>
          </div>
        )}
      </div>
    </footer>
  );
}
