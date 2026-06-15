import { CONFIG } from "@/lib/maylu-config";

export function DonationProgress() {
  const pct = Math.min(100, Math.round((CONFIG.recaudado / CONFIG.meta) * 100));
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
    </div>
  );
}
