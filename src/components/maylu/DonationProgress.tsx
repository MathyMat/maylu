import { CONFIG } from "@/lib/maylu-config";

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

export function DonationProgress() {
  const pct = Math.min(100, Math.round((CONFIG.recaudado / CONFIG.meta) * 100));
  const items = calcularAsignacion(CONFIG.recaudado);

  return (
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
                {item.nombre}
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
  );
}
