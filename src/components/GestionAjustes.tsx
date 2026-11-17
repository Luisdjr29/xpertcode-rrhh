import { useEffect, useState } from "react";
import { Empleado, Ajuste, AjusteExpense, Vacacion } from "../data";
import {
  AjusteSalarial,
  crearAjusteSalarial,
  obtenerAjustesSalariales,
} from "../services/ajustesSalarialesApi";

interface GestionAjustesProps {
  empleado: Empleado;
  empleados: Empleado[];
  onBack: () => void;
  onSelectEmpleado: (empleado: Empleado) => void;
  onSave: (patch: { ajustes?: Ajuste[]; ajustesExpenses?: AjusteExpense[]; vacaciones?: Vacacion[] }) => void;
}

type Tab = "salario" | "expenses" | "vacaciones";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function fmt(n: number) {
  return `RD$ ${n.toLocaleString("es-DO")}`;
}

function formatMoney(value: number | string | null | undefined, currency = "DOP") {
  if (value === null || value === undefined || value === "") return "No registrado";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "No registrado";
  return new Intl.NumberFormat(currency === "DOP" ? "es-DO" : "en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

function diffDays(from: string, to: string) {
  const a = new Date(from), b = new Date(to);
  if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
}

// ─── Salary tab ───────────────────────────────────────────────────────────────
function SalarioTab({ empleado }: {
  empleado: Empleado;
}) {
  const [salario, setSalario] = useState("");
  const [moneda, setMoneda] = useState<"DOP" | "USD">(
    empleado.monedaSalarioActual === "USD" ? "USD" : "DOP",
  );
  const [fechaEfectiva, setFechaEfectiva] = useState(today());
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rows, setRows] = useState<AjusteSalarial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setRows([]);
    setError("");
    obtenerAjustesSalariales(empleado.id)
      .then((history) => {
        if (active) setRows(history);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el historial salarial.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [empleado.id]);

  useEffect(() => {
    setMoneda(empleado.monedaSalarioActual === "USD" ? "USD" : "DOP");
    setSalario("");
    setMotivo("");
    setObservaciones("");
    setSuccess("");
  }, [empleado.id, empleado.monedaSalarioActual]);

  async function add() {
    const amount = Number(salario);
    if (!salario.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("El salario nuevo debe ser mayor que cero.");
      return;
    }
    if (!fechaEfectiva || !motivo.trim()) {
      setError("Completa la fecha efectiva y el motivo del ajuste.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const created = await crearAjusteSalarial(empleado.id, {
        salarioNuevo: salario,
        moneda,
        fechaEfectiva,
        motivo: motivo.trim(),
        observaciones: observaciones.trim(),
      });
      setRows((current) => [created, ...current]);
      setSuccess("El ajuste salarial se guardó en este navegador.");
      setSalario("");
      setMotivo("");
      setObservaciones("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo guardar el ajuste salarial.");
    } finally {
      setSaving(false);
    }
  }

  const salarioActual = formatMoney(empleado.salarioActual, empleado.monedaSalarioActual ?? moneda);
  const currentSalaryValue = empleado.salarioActual === null || empleado.salarioActual === undefined
    ? "No registrado"
    : String(empleado.salarioActual);
  const validSalary = salario.trim() !== "" && Number.isFinite(Number(salario)) && Number(salario) > 0;
  const submitDisabled = saving || !validSalary || !fechaEfectiva || !motivo.trim();
  const dateLabel = (date: string) => {
    const value = new Date(`${date}T00:00:00`);
    return Number.isNaN(value.getTime())
      ? date
      : value.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
  };
  const dateTimeLabel = (date: string) => {
    const value = new Date(date);
    return Number.isNaN(value.getTime())
      ? date
      : value.toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="space-y-5">
      {/* Current salary chip */}
      <div className="flex items-center gap-3 p-4 bg-[var(--secondary)] rounded-[var(--radius-lg)]">
        <div className="w-9 h-9 rounded bg-[var(--accent)] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">Salario actual</p>
          <p className="text-sm font-bold text-[var(--foreground)] font-['DM_Mono',monospace]">{salarioActual}</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Nuevo ajuste</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Salario actual</label>
            <input value={currentSalaryValue === "No registrado" ? currentSalaryValue : salarioActual} readOnly className={inp + " opacity-75"} />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Nuevo salario <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={salario}
              onChange={(e) => { setSalario(e.target.value); setError(""); setSuccess(""); }}
              placeholder="45000.00"
              className={inp}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Moneda</label>
            <select value={moneda} onChange={(e) => setMoneda(e.target.value as "DOP" | "USD")} className={inp} disabled={empleado.salarioActual !== null && empleado.salarioActual !== undefined}>
              <option value="DOP">DOP — Peso dominicano</option>
              <option value="USD">USD — Dólar estadounidense</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Fecha efectiva <span className="text-red-500">*</span></label>
            <input type="date" value={fechaEfectiva} onChange={(e) => { setFechaEfectiva(e.target.value); setError(""); }} className={inp} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Motivo <span className="text-red-500">*</span></label>
            <input value={motivo} maxLength={120} onChange={(e) => { setMotivo(e.target.value); setError(""); }} placeholder="Ej. Promoción, revisión anual..." className={inp} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Observaciones</label>
            <textarea value={observaciones} maxLength={1000} rows={3} onChange={(e) => setObservaciones(e.target.value)} placeholder="Información adicional (opcional)" className={inp + " resize-y"} />
          </div>
        </div>
        {error && <p role="alert" className="text-[11px] text-red-500 mt-2">{error}</p>}
        {success && <p role="status" className="text-[11px] text-emerald-700 mt-2">{success}</p>}
        <button onClick={() => void add()} disabled={submitDisabled} className={btnPrimary + " mt-4"}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {saving ? "Guardando..." : "Agregar ajuste"}
        </button>
      </div>

      {/* History */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Historial</h3>
        {loading ? (
          <p role="status" className="text-xs text-[var(--muted-foreground)] py-3 text-center">Cargando historial...</p>
        ) : rows.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] py-3 text-center">Sin registros</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Fecha efectiva", "Salario anterior", "Salario nuevo", "Diferencia", "% cambio", "Motivo", "Registrado"].map((h) => (
                  <th key={h} className="pb-2 pr-3 text-left text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((adjustment) => (
                <tr key={adjustment.id} className="border-b border-[var(--border)] last:border-0 align-top">
                  <td className="py-2.5 pr-3 text-[11px] text-[var(--muted-foreground)]">{dateLabel(adjustment.fechaEfectiva)}</td>
                  <td className="py-2.5 pr-3 text-[11px] font-['DM_Mono',monospace]">{adjustment.salarioAnterior === null ? "Salario inicial" : formatMoney(adjustment.salarioAnterior, adjustment.moneda)}</td>
                  <td className="py-2.5 pr-3 text-[11px] font-semibold font-['DM_Mono',monospace]">{formatMoney(adjustment.salarioNuevo, adjustment.moneda)}</td>
                  <td className="py-2.5 pr-3 text-[11px] font-['DM_Mono',monospace]">{adjustment.diferencia === null ? "—" : formatMoney(adjustment.diferencia, adjustment.moneda)}</td>
                  <td className="py-2.5 pr-3 text-[11px]">{adjustment.porcentajeCambio === null ? "—" : `${adjustment.porcentajeCambio}%`}</td>
                  <td className="py-2.5 pr-3 text-[11px]">
                    <span>{adjustment.motivo}</span>
                    {adjustment.observaciones && <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{adjustment.observaciones}</p>}
                  </td>
                  <td className="py-2.5 text-[10px] text-[var(--muted-foreground)]">{dateTimeLabel(adjustment.creadoEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Expenses tab ─────────────────────────────────────────────────────────────
function ExpensesTab({ empleado, onSave }: { empleado: Empleado; onSave: (rows: AjusteExpense[]) => void }) {
  const [tipo, setTipo] = useState("Aumento");
  const [montoNuevo, setMontoNuevo] = useState("");
  const [fecha, setFecha] = useState(today());
  const [fechaEfectiva, setFechaEfectiva] = useState(today());
  const [error, setError] = useState("");
  const [rows, setRows] = useState<AjusteExpense[]>(empleado.ajustesExpenses ?? []);

  const tipoOpts = ["Aumento", "Reducción", "Asignación inicial", "Ajuste"];
  const montoActual = rows[0]?.montoNuevo ?? 0;

  function add() {
    const monto = parseFloat(montoNuevo.replace(/[^0-9.]/g, ""));
    if (isNaN(monto) || monto <= 0) { setError("Ingresa un monto válido."); return; }
    const nuevo: AjusteExpense = {
      fecha: fmtDate(fecha),
      tipo,
      montoAnterior: montoActual,
      montoNuevo: monto,
      fechaEfectiva: fmtDate(fechaEfectiva),
    };
    const updated = [nuevo, ...rows];
    setRows(updated);
    onSave(updated);
    setMontoNuevo("");
    setError("");
  }

  return (
    <div className="space-y-5">
      {/* Current limit chip */}
      <div className="flex items-center gap-3 p-4 bg-[var(--secondary)] rounded-[var(--radius-lg)]">
        <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">Límite mensual actual</p>
          <p className="text-sm font-bold text-[var(--foreground)] font-['DM_Mono',monospace]">{montoActual > 0 ? fmt(montoActual) : "Sin asignar"}</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Nuevo ajuste</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inp}>
              {tipoOpts.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Nuevo límite mensual <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={montoNuevo}
              onChange={(e) => { setMontoNuevo(e.target.value); setError(""); }}
              placeholder="5000"
              className={inp}
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Fecha del ajuste</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inp} />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">Fecha efectiva</label>
            <input type="date" value={fechaEfectiva} onChange={(e) => setFechaEfectiva(e.target.value)} className={inp} />
          </div>
        </div>
        {montoActual > 0 && montoNuevo && !isNaN(parseFloat(montoNuevo)) && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
            <span className="font-['DM_Mono',monospace]">{fmt(montoActual)}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className={`font-semibold font-['DM_Mono',monospace] ${parseFloat(montoNuevo) > montoActual ? "text-emerald-700" : "text-red-600"}`}>
              {fmt(parseFloat(montoNuevo))}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${parseFloat(montoNuevo) > montoActual ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {parseFloat(montoNuevo) > montoActual ? `+${fmt(parseFloat(montoNuevo) - montoActual)}` : `-${fmt(montoActual - parseFloat(montoNuevo))}`}
            </span>
          </div>
        )}
        {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
        <button onClick={add} className={btnPrimary + " mt-4"}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar ajuste
        </button>
      </div>

      {/* History */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Historial</h3>
        {rows.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] py-3 text-center">Sin registros</p>
        ) : (
          <table className="w-full text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Tipo", "Salario", "F. Ajuste", "F. Efectiva"].map((h, i) => (
                  <th key={h} className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${i > 1 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const esInicial = a.tipo === "Asignación inicial";
                const delta = a.montoNuevo - a.montoAnterior;
                return (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${esInicial ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-700"}`}>
                        {a.tipo}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-semibold font-['DM_Mono',monospace] ${esInicial ? "text-[var(--foreground)]" : delta >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                          {esInicial ? fmt(a.montoNuevo) : `${delta >= 0 ? "+" : ""}${fmt(delta)}`}
                        </span>
                        {!esInicial && <span className="text-[10px] text-[var(--muted-foreground)] font-['DM_Mono',monospace]">{fmt(a.montoAnterior)} → {fmt(a.montoNuevo)}</span>}
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-[var(--muted-foreground)] font-['DM_Mono',monospace] text-[11px]">{a.fecha}</td>
                    <td className="py-2.5 text-right text-[var(--muted-foreground)] font-['DM_Mono',monospace] text-[11px]">{a.fechaEfectiva}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Vacaciones tab ───────────────────────────────────────────────────────────
function VacacionesTab({ empleado, onSave }: { empleado: Empleado; onSave: (rows: Vacacion[]) => void }) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Vacacion[]>(empleado.vacaciones);

  const dias = diffDays(desde, hasta);

  function add() {
    if (!desde || !hasta) { setError("Selecciona las fechas de inicio y fin."); return; }
    if (dias <= 0) { setError("La fecha de fin debe ser posterior a la de inicio."); return; }
    const dDesde = new Date(desde);
    const dHasta = new Date(hasta);
    const periodo = String(dDesde.getFullYear());
    const rango = `${dDesde.getDate()} ${dDesde.toLocaleDateString("es-DO", { month: "short" })}–${dHasta.getDate()} ${dHasta.toLocaleDateString("es-DO", { month: "short" })}`;
    const nuevo: Vacacion = { periodo, rango, dias: String(dias) };
    const updated = [nuevo, ...rows];
    setRows(updated);
    onSave(updated);
    setDesde(""); setHasta(""); setError("");
  }

  // Group by year for display
  const porAnio = rows.reduce<Record<string, Vacacion[]>>((acc, v) => {
    (acc[v.periodo] ??= []).push(v);
    return acc;
  }, {});
  const anios = Object.keys(porAnio).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-5">
      {/* Add form */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Nuevo período</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Fecha desde <span className="text-red-500">*</span>
            </label>
            <input type="date" value={desde} onChange={(e) => { setDesde(e.target.value); setError(""); }} className={inp} />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Fecha hasta <span className="text-red-500">*</span>
            </label>
            <input type="date" value={hasta} min={desde} onChange={(e) => { setHasta(e.target.value); setError(""); }} className={inp} />
          </div>
        </div>

        {desde && hasta && dias > 0 && (
          <div className="mt-3 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius)]">
            <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] text-amber-800">
              Período de <span className="font-bold font-['DM_Mono',monospace]">{dias} días</span> — {fmtDate(desde)} al {fmtDate(hasta)}
            </span>
          </div>
        )}

        {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
        <button onClick={add} disabled={!desde || !hasta || dias <= 0} className={btnPrimary + " mt-4"}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Registrar vacaciones
        </button>
      </div>

      {/* History grouped by year */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-4">Historial</h3>
        {rows.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)] py-3 text-center">Sin registros</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Año / Rango", "Días", "Total año"].map((h, i) => (
                  <th key={h} className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${i > 0 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anios.map((anio) => {
                const vacs = porAnio[anio];
                const total = vacs.reduce((s, v) => s + parseInt(v.dias), 0);
                return vacs.map((v, vi) => (
                  <tr key={`${anio}-${vi}`} className={vi === vacs.length - 1 ? "border-b-2 border-[var(--border)]" : "border-b border-[var(--border)]"}>
                    <td className="py-2">
                      {vi === 0 && <span className="text-[10px] font-bold text-[var(--foreground)] font-['DM_Mono',monospace] mr-2">{anio}</span>}
                      <span className="text-[11px] text-[var(--muted-foreground)] font-['DM_Mono',monospace]">{v.rango}</span>
                    </td>
                    <td className="py-2 text-right">
                      <span className="text-[10px] font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{v.dias}d</span>
                    </td>
                    <td className="py-2 text-right">
                      {vi === vacs.length - 1 && (
                        <span className="text-[11px] font-bold font-['DM_Mono',monospace] text-[var(--accent)]">{total}d</span>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inp = "w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]";
const btnPrimary = "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

// ─── Main component ───────────────────────────────────────────────────────────
export default function GestionAjustes({
  empleado,
  empleados,
  onBack,
  onSelectEmpleado,
  onSave,
}: GestionAjustesProps) {
  const [tab, setTab] = useState<Tab>("salario");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "salario",
      label: "Mantenimiento Salarial",
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      id: "expenses",
      label: "Mantenimiento de Expenses",
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    },
    {
      id: "vacaciones",
      label: "Vacaciones",
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
  ];

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Left sidebar */}
      <div className="w-64 shrink-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
          <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors shrink-0">
            <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-[var(--foreground)] truncate">Gestión de ajustes</h1>
            <p className="text-[11px] text-[var(--muted-foreground)] truncate">{empleado.nombre}</p>
          </div>
        </div>

        {/* Employee card */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(empleado.nombre)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{empleado.nombre}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{empleado.posicion}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-[var(--accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[11px] text-[var(--accent)] font-medium truncate">{empleado.cliente}</span>
          </div>
          <label className="mt-4 block text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">
            Seleccionar empleado
            <select
              value={empleado.id}
              onChange={(event) => {
                const next = empleados.find((candidate) => candidate.id === Number(event.target.value));
                if (next) onSelectEmpleado(next);
              }}
              className={inp + " mt-1.5"}
            >
              {empleados.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>{candidate.nombre} · {candidate.posicion}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Tab nav */}
        <nav className="flex-1 px-3 py-3 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius)] text-left text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              <span className={tab === t.id ? "text-white" : "text-[var(--muted-foreground)]"}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="px-5 py-4 border-t border-[var(--border)] space-y-2">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-2">Resumen</p>
          {[
            { label: "Salario actual", value: formatMoney(empleado.salarioActual, empleado.monedaSalarioActual ?? "DOP") },
            { label: "Limite expenses", value: empleado.ajustesExpenses?.[0]?.montoNuevo ? fmt(empleado.ajustesExpenses[0].montoNuevo) : "Sin asignar" },
            { label: "Días vac. tomados", value: `${empleado.vacaciones.reduce((s, v) => s + parseInt(v.dias), 0)}d` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[10px] text-[var(--muted-foreground)]">{label}</span>
              <span className="text-[10px] font-semibold text-[var(--foreground)] font-['DM_Mono',monospace]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {tab === "salario" && (
            <SalarioTab
              empleado={empleado}
            />
          )}
          {tab === "expenses" && (
            <ExpensesTab
              empleado={empleado}
              onSave={(rows) => onSave({ ajustesExpenses: rows })}
            />
          )}
          {tab === "vacaciones" && (
            <VacacionesTab
              empleado={empleado}
              onSave={(rows) => onSave({ vacaciones: rows })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
