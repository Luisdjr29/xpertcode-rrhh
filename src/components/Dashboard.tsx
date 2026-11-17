import { useState } from "react";
import { Empleado } from "../data";
import ExpensesCard from "./ExpensesCard";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


const avatarPalette = [
  "bg-green-100 text-green-800",
  "bg-teal-100 text-teal-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-700",
  "bg-lime-100 text-lime-800",
  "bg-cyan-100 text-cyan-800",
  "bg-violet-100 text-violet-700",
];

function avatarColor(id: number) {
  return avatarPalette[id % avatarPalette.length];
}

function formatSalary(value: number | string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-DO", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatEffectiveDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

interface DashboardProps {
  empleados: Empleado[];
  onGenerarCarta: (emp: Empleado) => void;
  onNuevoEmpleado: () => void;
  onEditarEmpleado: (emp: Empleado) => void;
  onGestionarAjustes: (emp: Empleado) => void;
  onLogout: () => void;
}

export default function Dashboard({ empleados, onGenerarCarta, onNuevoEmpleado, onEditarEmpleado, onGestionarAjustes, onLogout }: DashboardProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filtered = empleados.filter((e) =>
    e.nombre.toLowerCase().includes(query.toLowerCase()) ||
    e.posicion.toLowerCase().includes(query.toLowerCase()) ||
    e.cliente.toLowerCase().includes(query.toLowerCase())
  );

  const currentId = activeId ?? empleados[0]?.id ?? null;
  const emp = empleados.find((e) => e.id === currentId) ?? empleados[0];
  const salaryAdjustments = emp.ajustesSalariales ?? [];

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col">
        <div className="px-4 pt-4 pb-4 border-b border-[var(--border)]">
          {/* XpertCode logo */}
          <div className="flex items-center gap-2 mb-3">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="6" fill="#2b8a57"/>
              <path d="M8 8L20 20L8 32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 8L20 20L32 32" stroke="#f5a623" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="text-sm font-bold text-[var(--foreground)] leading-none">XpertCode</span>
              <p className="text-[9px] tracking-widest uppercase text-[var(--muted-foreground)] leading-none mt-0.5">Software Factory</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
              Maestro de Empleados
            </span>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-[var(--border)]">
          <div className="relative">
            <svg
              className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[var(--muted-foreground)]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] outline-none focus:ring-1 focus:ring-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)] px-2 py-4 text-center">Sin resultados</p>
          ) : (
            filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveId(e.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius)] text-left transition-colors mb-0.5 ${
                  e.id === currentId
                    ? "bg-[var(--accent)] text-white"
                    : "hover:bg-[var(--secondary)] text-[var(--foreground)]"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                    e.id === currentId ? "bg-white/20 text-white" : avatarColor(e.id)
                  }`}
                >
                  {initials(e.nombre)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate leading-tight">{e.nombre}</p>
                  <p className={`text-[11px] truncate leading-tight ${e.id === currentId ? "text-blue-100" : "text-[var(--muted-foreground)]"}`}>
                    {e.posicion}
                  </p>
                </div>
              </button>
            ))
          )}
        </nav>

        <div className="px-3 py-3 border-t border-[var(--border)] space-y-2">
          <button
            onClick={onNuevoEmpleado}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo empleado
          </button>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[var(--muted-foreground)]">
              {empleados.filter((e) => e.estatus === "Activo").length} activos · {empleados.length} total
            </p>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Profile card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarColor(emp.id)}`}>
                {initials(emp.nombre)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[var(--foreground)]">{emp.nombre}</h2>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${emp.estatus === "Activo" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    {emp.estatus}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{emp.posicion} · {emp.departamento}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg className="w-3 h-3 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs text-[var(--accent)] font-medium">{emp.cliente}</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                  Salario actual: <span className="font-semibold text-[var(--foreground)]">{emp.salarioActual === null || emp.salarioActual === undefined
                    ? "No registrado"
                    : new Intl.NumberFormat(emp.monedaSalarioActual === "USD" ? "en-US" : "es-DO", {
                      style: "currency",
                      currency: emp.monedaSalarioActual ?? "DOP",
                    }).format(Number(emp.salarioActual))}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onEditarEmpleado(emp)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] hover:bg-[var(--secondary)] transition-colors text-[var(--foreground)]"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => onGestionarAjustes(emp)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--accent)] text-[var(--accent)] rounded-[var(--radius)] bg-[var(--card)] hover:bg-[var(--secondary)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Ajustes
              </button>
              <button
                onClick={() => onGenerarCarta(emp)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generar carta
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-5 pt-4 border-t border-[var(--border)]">
            {[
              { label: "Cédula", value: emp.cedula },
              { label: "Nacimiento", value: emp.fechaNacimiento || "—" },
              { label: "Ingreso", value: emp.ingreso },
              { label: "Supervisor", value: emp.supervisor || "—" },
              { label: "Teléfono", value: emp.telefono || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-0.5">{label}</p>
                <p className="text-xs font-medium text-[var(--foreground)] font-['DM_Mono',monospace]">{value}</p>
              </div>
            ))}
          </div>
          {emp.estatus === "Inactivo" && (emp.fechaSalida || emp.motivoSalida) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-red-500">Salida</span>
              {emp.fechaSalida && <span className="text-xs text-[var(--muted-foreground)]">Fecha: <span className="font-medium text-[var(--foreground)]">{emp.fechaSalida}</span></span>}
              {emp.motivoSalida && <span className="text-xs text-[var(--muted-foreground)]">Motivo: <span className="font-medium text-[var(--foreground)]">{emp.motivoSalida}</span></span>}
              {emp.banco && <span className="text-xs text-[var(--muted-foreground)]">Banco: <span className="font-medium text-[var(--foreground)]">{emp.banco}</span></span>}
            </div>
          )}
          {emp.estatus === "Activo" && (emp.banco || emp.numeroCuenta) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
              {emp.banco && <span className="text-xs text-[var(--muted-foreground)]">Banco: <span className="font-medium text-[var(--foreground)]">{emp.banco}</span></span>}
              {emp.numeroCuenta && <span className="text-xs text-[var(--muted-foreground)]">Cta: <span className="font-medium text-[var(--foreground)] font-['DM_Mono',monospace]">{emp.numeroCuenta}</span></span>}
              {emp.comentario && <span className="text-xs text-[var(--muted-foreground)] truncate max-w-xs">Nota: <span className="italic text-[var(--foreground)]">{emp.comentario}</span></span>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Salary history */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]">Historial de Ajustes Salarial</h3>
                <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
                  {salaryAdjustments.length > 0 ? "Ajustes registrados en Mantenimiento Salarial." : "Historial anterior de muestra."}
                </p>
              </div>
              <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                {salaryAdjustments.length > 0 ? salaryAdjustments.length : emp.ajustes.length} registros
              </span>
            </div>
            {salaryAdjustments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Motivo", "Salario nuevo", "F. Efectiva"].map((heading, index) => (
                        <th
                          key={heading}
                          className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${index > 0 ? "text-right" : "text-left"}`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salaryAdjustments.map((adjustment) => (
                      <tr key={adjustment.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2.5 pr-2 text-[11px] text-[var(--foreground)]">{adjustment.motivo}</td>
                        <td className="py-2.5 text-right font-['DM_Mono',monospace] font-medium text-[var(--foreground)] text-[11px]">
                          {formatSalary(adjustment.salarioNuevo, adjustment.moneda)}
                        </td>
                        <td className="py-2.5 text-right text-[var(--muted-foreground)] font-['DM_Mono',monospace] text-[11px]">
                          {formatEffectiveDate(adjustment.fechaEfectiva)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : emp.ajustes.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] py-4 text-center">Sin registros</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Tipo", "Salario", "F. Efectiva"].map((h, i) => (
                      <th
                        key={h}
                        className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${i === 1 ? "text-right" : i === 2 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emp.ajustes.map((a, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-2.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          a.tipo === "Ingreso" ? "bg-green-50 text-green-800" :
                          a.tipo === "Aumento" ? "bg-emerald-50 text-emerald-700" :
                          "bg-violet-50 text-violet-700"
                        }`}>
                          {a.tipo}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-['DM_Mono',monospace] font-medium text-[var(--foreground)] text-[11px]">{a.salario}</td>
                      <td className="py-2.5 text-right text-[var(--muted-foreground)] font-['DM_Mono',monospace] text-[11px]">{a.fechaEfectiva}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Expenses */}
          <ExpensesCard ajustesExpenses={emp.ajustesExpenses} />

          {/* Vacation history */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
            {(() => {
              const porAnio = emp.vacaciones.reduce<Record<string, typeof emp.vacaciones>>((acc, v) => {
                (acc[v.periodo] ??= []).push(v);
                return acc;
              }, {});
              const anios = Object.keys(porAnio).sort((a, b) => Number(b) - Number(a));

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]">Historial de Vacaciones</h3>
                    <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                      {anios.length} año{anios.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {emp.vacaciones.length === 0 ? (
                    <p className="text-xs text-[var(--muted-foreground)] py-4 text-center">Sin registros</p>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          {["Año / Rango", "Días", "Total año"].map((h, i) => (
                            <th key={h} className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${i > 0 ? "text-right" : "text-left"}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {anios.map((anio) => {
                          const vacs = porAnio[anio];
                          const total = vacs.reduce((s, v) => s + parseInt(v.dias), 0);
                          return vacs.map((v, vi) => {
                            const isFirst = vi === 0;
                            const isLast = vi === vacs.length - 1;
                            return (
                              <tr key={`${anio}-${vi}`} className={isLast ? "border-b-2 border-[var(--border)]" : "border-b border-[var(--border)]"}>
                                <td className="py-2 pl-0">
                                  {isFirst && (
                                    <span className="text-[10px] font-bold text-[var(--foreground)] font-['DM_Mono',monospace] mr-2">{anio}</span>
                                  )}
                                  <span className="text-[11px] text-[var(--muted-foreground)] font-['DM_Mono',monospace]">{v.rango}</span>
                                </td>
                                <td className="py-2 text-right">
                                  <span className="text-[10px] font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{v.dias}d</span>
                                </td>
                                <td className="py-2 text-right">
                                  {isLast && (
                                    <span className="text-[11px] font-bold font-['DM_Mono',monospace] text-[var(--accent)]">
                                      {total}d
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </table>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
