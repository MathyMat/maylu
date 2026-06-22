import { useState } from "react";
import { CONFIG } from "@/lib/maylu-config";
import { photos } from "@/lib/maylu-photos";

function calcularAsignacion(recaudado: number) {
  let restante = recaudado;
  return CONFIG.subMetas.map((sm) => {
    const asignado = Math.min(restante, sm.meta);
    restante -= asignado;
    return {
      ...sm,
      asignado,
      pct: Math.min(100, Math.round((asignado / sm.meta) * 100)),
      cumplido: asignado >= sm.meta,
    };
  });
}

const HEMO_INFO = {
  hematologia:
    "Las plaquetas están bien en cantidad y tamaño. El único hallazgo es el plaquetocrito (PCT) elevado, que suele indicar una reacción inflamatoria leve, no un problema de la sangre en sí",
  bioquimica:
    "El hígado funciona normal. Las globulinas altas sugieren un proceso inflamatorio o infeccioso leve en curso. La urea y creatinina están en el límite alto, compatible con estrés renal temprano para su edad",
};

export function DonationProgress() {
  const [hemoOpen, setHemoOpen] = useState(false);
  const pct = Math.min(100, Math.round((CONFIG.recaudado / CONFIG.meta) * 100));
  const items = calcularAsignacion(CONFIG.recaudado);

  return (
    <>
    <div className="rounded-3xl border-2 border-butter bg-white/80 p-6 shadow-[0_8px_0_-2px_var(--color-honey)]">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cocoa/70">
            Meta de colecta
          </p>
          <p className="font-display text-3xl font-bold text-cocoa">
            S/ {CONFIG.recaudado.toLocaleString()}{" "}
            <span className="text-base font-normal text-cocoa/60">
              de S/ {CONFIG.meta.toLocaleString()}
            </span>
          </p>
        </div>
        <span className="rounded-full bg-butter px-3 py-1 font-display text-sm font-bold text-cocoa">
          {pct}%
        </span>
      </div>

      <div className="mt-4 h-4 overflow-hidden rounded-full bg-cream ring-1 ring-butter/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-honey to-butter transition-all"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.nombre}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-cocoa flex items-center gap-1.5">
                {item.cumplido && <span className="text-green-600 text-xs">✓</span>}
                {item.nombre === "Hemograma" ? (
                  <button
                    onClick={() => setHemoOpen(true)}
                    className="cursor-pointer underline decoration-dotted decoration-honey/60 underline-offset-2 transition hover:decoration-honey"
                  >
                    {item.nombre}
                  </button>
                ) : (
                  item.nombre
                )}
                {item.nombre === "Hemograma" && (
                  <span className="text-[10px] text-honey ml-1 italic">ver hemograma</span>
                )}
              </span>
              <span className="text-xs text-cocoa/60 tabular-nums flex items-center gap-2">
                {item.cumplido && <span className="text-green-600 font-bold">MUCHAS GRACIAS!!!</span>}
                S/ {item.asignado.toLocaleString()} / S/ {item.meta.toLocaleString()}{" "}
                <span className="font-bold text-cocoa/80">({item.pct}%)</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-cream ring-1 ring-inset ring-butter/40">
              <div
                className={`h-full rounded-full transition-all ${
                  item.cumplido
                    ? "bg-green-400"
                    : "bg-gradient-to-r from-honey to-butter"
                }`}
                style={{ width: `${item.pct || (item.asignado > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <a
        href="#donadores"
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-cocoa/15 py-2 text-sm font-semibold text-cocoa/60 transition hover:border-cocoa/30 hover:text-cocoa"
      >
        Ver quiénes donaron
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </div>

      {hemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/88 backdrop-blur-md"
          onClick={() => setHemoOpen(false)}
          style={{ animation: "hfFadeIn 0.18s ease" }}
        >
          <style>{`
            @keyframes hfFadeIn {
              from { opacity: 0 }
              to   { opacity: 1 }
            }
            @keyframes hfScale {
              from { opacity: 0; transform: scale(0.95) }
              to   { opacity: 1; transform: scale(1) }
            }
          `}</style>

          <button
            onClick={() => setHemoOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow-md transition hover:bg-butter focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="mx-4 max-w-3xl rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "hfScale 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src={photos.hematologia}
                  alt="Resultados de hematología"
                  className="w-full rounded-xl object-contain"
                  style={{ animation: "hfScale 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                />
                <p className="mt-2 text-xs leading-relaxed text-cocoa/80">
                  <strong className="text-cocoa">Hematología:</strong> {HEMO_INFO.hematologia}
                </p>
              </div>
              <div>
                <img
                  src={photos.bioquimica}
                  alt="Resultados de bioquímica"
                  className="w-full rounded-xl object-contain"
                  style={{ animation: "hfScale 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both" }}
                />
                <p className="mt-2 text-xs leading-relaxed text-cocoa/80">
                  <strong className="text-cocoa">Bioquímica:</strong> {HEMO_INFO.bioquimica}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
