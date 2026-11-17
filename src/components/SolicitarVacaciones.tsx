import { useState } from "react";
import { Empleado } from "../data";

interface SolicitarVacacionesProps {
  empleado: Empleado;
  onBack: () => void;
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function diffDays(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  if (isNaN(a.getTime()) || isNaN(b.getTime()) || b <= a) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
}

type Step = "form" | "confirm" | "success";

export default function SolicitarVacaciones({ empleado, onBack }: SolicitarVacacionesProps) {
  const [step, setStep] = useState<Step>("form");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState("vacaciones");

  const dias = diffDays(desde, hasta);
  const isValid = desde && hasta && dias > 0;

  const diasUsados = empleado.vacaciones.reduce((s, v) => s + parseInt(v.dias), 0);
  const diasDisponibles = 21 - diasUsados;

  const tiposVac = [
    { id: "vacaciones", label: "Vacaciones anuales" },
    { id: "personal", label: "Días personales" },
    { id: "medico", label: "Permiso médico" },
    { id: "otro", label: "Otro" },
  ];

  if (step === "success") {
    return (
      <div className="flex h-full bg-[var(--background)] items-center justify-center">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-10 max-w-sm w-full text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">Solicitud enviada</h2>
          <p className="text-xs text-[var(--muted-foreground)] mb-1">{empleado.nombre}</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-5">
            {formatDate(desde)} → {formatDate(hasta)} · <span className="font-semibold text-[var(--foreground)]">{dias} días</span>
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)] mb-6">
            La solicitud fue enviada al supervisor para aprobación. El empleado recibirá una notificación con la resolución.
          </p>
          <button
            onClick={onBack}
            className="w-full py-2 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="flex h-full bg-[var(--background)] items-center justify-center">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 max-w-sm w-full shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-5">Confirmar solicitud</h2>

          <div className="space-y-3 mb-6">
            {[
              { label: "Empleado", value: empleado.nombre },
              { label: "Cargo", value: empleado.posicion },
              { label: "Tipo", value: tiposVac.find((t) => t.id === tipo)?.label ?? tipo },
              { label: "Desde", value: formatDate(desde) },
              { label: "Hasta", value: formatDate(hasta) },
              { label: "Total de días", value: `${dias} días hábiles` },
              ...(motivo ? [{ label: "Motivo", value: motivo }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] shrink-0">{label}</span>
                <span className="text-xs text-[var(--foreground)] text-right font-['DM_Mono',monospace]">{value}</span>
              </div>
            ))}
          </div>

          {dias > diasDisponibles && (
            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius)] mb-4">
              <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-amber-800">Solicita {dias} días pero el empleado tiene {diasDisponibles} disponibles.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep("form")}
              className="flex-1 py-2 text-xs font-medium border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors text-[var(--foreground)]"
            >
              Editar
            </button>
            <button
              onClick={() => setStep("success")}
              className="flex-1 py-2 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors"
            >
              Confirmar y enviar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Left: form */}
      <div className="w-72 shrink-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors"
          >
            <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-semibold text-[var(--foreground)]">Solicitar vacaciones</h1>
            <p className="text-[11px] text-[var(--muted-foreground)]">{empleado.nombre}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Employee summary */}
          <div className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-[var(--radius)]">
            <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(empleado.nombre)}
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">{empleado.nombre}</p>
              <p className="text-[11px] text-[var(--muted-foreground)]">{empleado.posicion}</p>
            </div>
          </div>

          {/* Balance */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Disponibles", value: diasDisponibles, color: "text-emerald-700 bg-emerald-50" },
              { label: "Usados", value: diasUsados, color: "text-amber-700 bg-amber-50" },
              { label: "Total/año", value: 21, color: "text-green-800 bg-green-50" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-[var(--radius)] p-2 text-center ${color}`}>
                <p className="text-base font-bold font-['DM_Mono',monospace]">{value}</p>
                <p className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Tipo */}
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Tipo de permiso
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
            >
              {tiposVac.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                Fecha desde
              </label>
              <input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                Fecha hasta
              </label>
              <input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                min={desde}
                className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
              />
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Motivo <span className="normal-case font-normal">(opcional)</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Describa el motivo si aplica..."
              className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)] resize-none placeholder:text-[var(--muted-foreground)]"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)]">
          {isValid && (
            <p className="text-[11px] text-center text-[var(--muted-foreground)] mb-2">
              <span className="font-semibold text-[var(--foreground)] font-['DM_Mono',monospace]">{dias}</span> días seleccionados
            </p>
          )}
          <button
            onClick={() => setStep("confirm")}
            disabled={!isValid}
            className="w-full py-2 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      </div>

      {/* Right: calendar visual */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-6">Historial de períodos</h2>

        <div className="space-y-3 mb-8">
          {empleado.vacaciones.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)]">Sin historial de vacaciones.</p>
          ) : (
            empleado.vacaciones.map((v, i) => (
              <div key={i} className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3">
                <div className="w-8 h-8 rounded bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-amber-700 font-['DM_Mono',monospace]">{v.dias}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--foreground)]">Período {v.periodo}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)] font-['DM_Mono',monospace]">{v.rango}</p>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Aprobado</span>
              </div>
            ))
          )}
        </div>

        {isValid && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 max-w-sm">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-3">Nueva solicitud</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-700 font-['DM_Mono',monospace]">{dias}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)]">{formatDate(desde)} → {formatDate(hasta)}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{tiposVac.find((t) => t.id === tipo)?.label}</p>
              </div>
            </div>
            {dias > diasDisponibles && (
              <div className="flex gap-2 items-start mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-[var(--radius)]">
                <svg className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-amber-800">Excede los {diasDisponibles} días disponibles del empleado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
