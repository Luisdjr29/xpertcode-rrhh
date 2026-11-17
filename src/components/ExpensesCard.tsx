import { AjusteExpense } from "../data";


function fmt(n: number) {
  return `RD$ ${n.toLocaleString("es-DO")}`;
}

interface ExpensesCardProps {
  ajustesExpenses: AjusteExpense[];
}

export default function ExpensesCard({ ajustesExpenses = [] }: ExpensesCardProps) {
  const lista = ajustesExpenses;
  const montoActual = lista[0]?.montoNuevo ?? 0;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]">
          Historial de Ajustes de Expenses
        </h3>
        <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
          {lista.length} registros
        </span>
      </div>

      {lista.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-[var(--radius)] mb-4">
          <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">Límite mensual actual</p>
            <p className="text-sm font-bold text-[var(--foreground)] font-['DM_Mono',monospace]">{fmt(montoActual)}</p>
          </div>
        </div>
      )}

      {lista.length === 0 ? (
        <p className="text-xs text-[var(--muted-foreground)] py-4 text-center">Sin registros de ajustes</p>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Tipo", "Monto", "F. Efectiva"].map((h, i) => (
                <th
                  key={h}
                  className={`pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] ${i > 0 ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((a, i) => {
              const esInicial = a.tipo === "Asignación inicial";
              const delta = a.montoNuevo - a.montoAnterior;
              return (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-fit ${
                        esInicial
                          ? "bg-green-50 text-green-800"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {a.tipo}
                      </span>
                      {!esInicial && (
                        <span className="text-[10px] text-[var(--muted-foreground)] font-['DM_Mono',monospace]">
                          {fmt(a.montoAnterior)} → {fmt(a.montoNuevo)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 text-right align-top">
                    <span className={`text-[11px] font-semibold font-['DM_Mono',monospace] ${
                      esInicial ? "text-[var(--foreground)]" : "text-emerald-700"
                    }`}>
                      {esInicial ? fmt(a.montoNuevo) : `+${fmt(delta)}`}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[var(--muted-foreground)] font-['DM_Mono',monospace] text-[11px] align-top">
                    {a.fechaEfectiva}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
