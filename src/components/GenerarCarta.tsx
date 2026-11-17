import { useState } from "react";
import { Empleado } from "../data";

interface GenerarCartaProps {
  empleado: Empleado;
  onBack: () => void;
}

const tiposCarta = [
  { id: "laboral",   label: "Constancia laboral",    desc: "Certifica la relación laboral vigente del empleado." },
  { id: "ingresos",  label: "Constancia de ingresos", desc: "Indica el salario actual del empleado." },
  { id: "referencias", label: "Carta de referencias", desc: "Referencia profesional para uso externo." },
  { id: "vac-mes",   label: "Vacaciones por mes",     desc: "Detalla las vacaciones cursadas en un mes específico." },
  { id: "vac-ano",   label: "Vacaciones por año",     desc: "Resumen de todas las vacaciones cursadas en un año." },
];

const destinatarios = ["A quien corresponda", "Banco", "Embajada / Consulado", "Institución educativa", "Otro"];

const aniosDisponibles = ["2026", "2025", "2024", "2023"];
const mesesDisponibles = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function GenerarCarta({ empleado, onBack }: GenerarCartaProps) {
  const [tipo, setTipo] = useState("laboral");
  const [destinatario, setDestinatario] = useState("A quien corresponda");
  const [incluirSalario, setIncluirSalario] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [anio, setAnio] = useState("2026");
  const [mes, setMes] = useState("Septiembre");
  const [generada, setGenerada] = useState(false);
  const [refEmpresa, setRefEmpresa] = useState("XpertCode S.R.L.");
  const [refRnc, setRefRnc] = useState("1-31-81375-5");
  const [refCiudad, setRefCiudad] = useState("Santo Domingo, D.N.");
  const [refNombre, setRefNombre] = useState(empleado.nombre);
  const [refCedula, setRefCedula] = useState(empleado.cedula);
  const [refCargo, setRefCargo] = useState(empleado.posicion);
  const [refIngreso, setRefIngreso] = useState(empleado.ingreso);
  const [refSalario, setRefSalario] = useState(empleado.ajustes[0]?.salario ?? "");
  const [refFirmante, setRefFirmante] = useState("Arturo Ernesto Manzueta Alburquerque");
  const [refCedulaFirmante, setRefCedulaFirmante] = useState("001-0002619-4");
  const [refCargoFirmante, setRefCargoFirmante] = useState("Gerente General");
  const [refTelefono, setRefTelefono] = useState("809-796-3470");
  const esReferencia = tipo === "referencias";
  const camposRef = [
    { label: "Empresa", value: refEmpresa, set: setRefEmpresa },
    { label: "RNC de la empresa", value: refRnc, set: setRefRnc },
    { label: "Ciudad", value: refCiudad, set: setRefCiudad },
    { label: "Nombre del empleado", value: refNombre, set: setRefNombre },
    { label: "Cédula del empleado", value: refCedula, set: setRefCedula },
    { label: "Cargo del empleado", value: refCargo, set: setRefCargo },
    { label: "Fecha de ingreso", value: refIngreso, set: setRefIngreso },
    { label: "Salario mensual", value: refSalario, set: setRefSalario },
    { label: "Firmante", value: refFirmante, set: setRefFirmante },
    { label: "Cédula del firmante", value: refCedulaFirmante, set: setRefCedulaFirmante },
    { label: "Cargo del firmante", value: refCargoFirmante, set: setRefCargoFirmante },
    { label: "Celular", value: refTelefono, set: setRefTelefono },
  ];

  const salarioActual = empleado.ajustes[0]?.salario ?? "—";
  const tipoSeleccionado = tiposCarta.find((t) => t.id === tipo)!;
  const esVacaciones = tipo === "vac-mes" || tipo === "vac-ano";

  // Filter vacaciones by selected period
  const vacsFiltradas = tipo === "vac-ano"
    ? empleado.vacaciones.filter((v) => v.periodo === anio)
    : tipo === "vac-mes"
    ? empleado.vacaciones.filter((v) => v.periodo === anio && v.rango.toLowerCase().includes(mes.slice(0, 3).toLowerCase()))
    : [];

  const preview = generada
    ? esReferencia
      ? buildReferencia({
          empresa: refEmpresa, rnc: refRnc, ciudad: refCiudad, nombre: refNombre,
          cedula: refCedula, cargo: refCargo, ingreso: refIngreso, salario: refSalario,
          firmante: refFirmante, cedulaFirmante: refCedulaFirmante,
          cargoFirmante: refCargoFirmante, telefono: refTelefono,
        })
      : buildPreview(empleado, tipo, tipoSeleccionado.label, destinatario, incluirSalario, salarioActual, vacsFiltradas, anio, mes)
    : null;

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Left panel */}
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
            <h1 className="text-sm font-semibold text-[var(--foreground)]">Generar carta</h1>
            <p className="text-[11px] text-[var(--muted-foreground)]">{empleado.nombre}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Employee summary */}
          <div className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-[var(--radius)]">
            <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(empleado.nombre)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{empleado.nombre}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">{empleado.posicion}</p>
            </div>
          </div>

          {/* Tipo de carta */}
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-2">
              Tipo de carta
            </label>
            <div className="space-y-1.5">
              {tiposCarta.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-[var(--radius)] border cursor-pointer transition-colors ${
                    tipo === t.id
                      ? "border-[var(--accent)] bg-green-50"
                      : "border-[var(--border)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={t.id}
                    checked={tipo === t.id}
                    onChange={() => { setTipo(t.id); setGenerada(false); }}
                    className="mt-0.5 accent-[var(--accent)]"
                  />
                  <div>
                    <p className="text-xs font-medium text-[var(--foreground)]">{t.label}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Period filters for vacation letters */}
          {esVacaciones && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                  Año
                </label>
                <select
                  value={anio}
                  onChange={(e) => { setAnio(e.target.value); setGenerada(false); }}
                  className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
                >
                  {aniosDisponibles.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              {tipo === "vac-mes" && (
                <div>
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                    Mes
                  </label>
                  <select
                    value={mes}
                    onChange={(e) => { setMes(e.target.value); setGenerada(false); }}
                    className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  >
                    {mesesDisponibles.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              )}
              {/* Preview of matching vacations */}
              <div className="bg-[var(--secondary)] rounded-[var(--radius)] p-3">
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-2">
                  Vacaciones encontradas
                </p>
                {vacsFiltradas.length === 0 ? (
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Sin registros para el período seleccionado.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {vacsFiltradas.map((v, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-[var(--foreground)] font-medium">{v.rango}</span>
                        <span className="text-[var(--muted-foreground)] font-['DM_Mono',monospace]">{v.dias} días</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-[11px] pt-1 border-t border-[var(--border)] mt-1">
                      <span className="font-semibold text-[var(--foreground)]">Total</span>
                      <span className="font-semibold text-[var(--accent)] font-['DM_Mono',monospace]">
                        {vacsFiltradas.reduce((s, v) => s + parseInt(v.dias), 0)} días
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Datos de la carta de referencias */}
          {esReferencia && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block">
                Datos de la carta
              </label>
              {camposRef.map((c) => (
                <div key={c.label}>
                  <label className="text-[11px] text-[var(--foreground)] block mb-1">{c.label}</label>
                  <input
                    value={c.value}
                    onChange={(e) => { c.set(e.target.value); setGenerada(false); }}
                    className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Destinatario */}
          {!esReferencia && (
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Destinatario
            </label>
            <select
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]"
            >
              {destinatarios.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          )}

          {/* Idioma */}
          <div>
            <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
              Idioma
            </label>
            <div className="flex gap-2">
              {[{ id: "es", label: "Español" }, { id: "en", label: "Inglés" }].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setIdioma(l.id)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-[var(--radius)] border transition-colors ${
                    idioma === l.id
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opciones */}
          {!esVacaciones && !esReferencia && (
            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-2">
                Opciones
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluirSalario}
                  onChange={(e) => setIncluirSalario(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                <span className="text-xs text-[var(--foreground)]">Incluir salario actual</span>
              </label>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)]">
          <button
            onClick={() => setGenerada(true)}
            disabled={esVacaciones && vacsFiltradas.length === 0}
            className="w-full py-2 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generar vista previa
          </button>
        </div>
      </div>

      {/* Right panel: preview */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        {!generada ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs">
            <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">Vista previa de carta</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {esVacaciones && vacsFiltradas.length === 0
                ? "No hay vacaciones en el período seleccionado."
                : "Configure los parámetros y presione \"Generar vista previa\""}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[var(--muted-foreground)]">Vista previa · {tipoSeleccionado.label}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setGenerada(false)}
                  className="text-xs px-3 py-1.5 border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors text-[var(--foreground)]"
                >
                  Editar
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar PDF
                </button>
              </div>
            </div>

            {/* Paper */}
            <div className="print-area bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-10 text-sm leading-relaxed text-gray-800">
              <div className="mb-8 pb-6 border-b border-gray-200 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="6" fill="#2b8a57"/>
                    <path d="M8 8L20 20L8 32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M32 8L20 20L32 32" stroke="#f5a623" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <p className="text-base font-bold text-gray-900 tracking-tight">XpertCode S.R.L.</p>
                    <p className="text-xs text-gray-500">Software Factory · Santo Domingo, RD</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Santo Domingo, {new Date().toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>

              <div className="whitespace-pre-line text-sm text-gray-800 leading-7 font-serif">{preview}</div>

              {/* Vacation table inside paper */}
              {esVacaciones && vacsFiltradas.length > 0 && (
                <div className="mt-6 border border-gray-200 rounded overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-600 font-semibold">Período</th>
                        <th className="text-left px-4 py-2 text-gray-600 font-semibold">Rango de fechas</th>
                        <th className="text-right px-4 py-2 text-gray-600 font-semibold">Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacsFiltradas.map((v, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-700">{v.periodo}</td>
                          <td className="px-4 py-2 text-gray-700">{v.rango}</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-900">{v.dias}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-gray-200 bg-gray-50">
                        <td colSpan={2} className="px-4 py-2 font-semibold text-gray-700">Total</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-900">
                          {vacsFiltradas.reduce((s, v) => s + parseInt(v.dias), 0)} días
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {!esReferencia && <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <div>
                    <p className="font-medium text-gray-700">Firma autorizada</p>
                    <div className="w-32 border-b border-gray-400 mt-8 mb-1"></div>
                    <p>Gerencia de RR.HH.</p>
                  </div>
                  <div className="text-right">
                    <p>Documento generado el</p>
                    <p className="font-['DM_Mono',monospace]">{new Date().toLocaleDateString("es-DO")}</p>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildPreview(
  emp: Empleado,
  tipo: string,
  tipoLabel: string,
  dest: string,
  inclSalario: boolean,
  salario: string,
  vacs: { periodo: string; rango: string; dias: string }[],
  anio: string,
  mes: string,
) {
  const totalDias = vacs.reduce((s, v) => s + parseInt(v.dias), 0);

  if (tipo === "vac-ano") {
    return `${dest}:

Por medio de la presente, XpertCode S.R.L. hace constar que el/la Sr./Sra. ${emp.nombre}, titular de la cédula de identidad ${emp.cedula}, labora en nuestra organización en el cargo de ${emp.posicion}, destacado en ${emp.cliente}, disfrutó de las siguientes vacaciones durante el año ${anio}:

(Ver detalle en la tabla adjunta)

Total de días de vacaciones cursados en ${anio}: ${totalDias} días.

La presente constancia se expide a solicitud de la parte interesada para los fines que estime pertinentes.

Atentamente,`;
  }

  if (tipo === "vac-mes") {
    return `${dest}:

Por medio de la presente, XpertCode S.R.L. hace constar que el/la Sr./Sra. ${emp.nombre}, titular de la cédula de identidad ${emp.cedula}, labora en nuestra organización en el cargo de ${emp.posicion}, destacado en ${emp.cliente}, disfrutó de vacaciones durante el mes de ${mes} de ${anio}:

(Ver detalle en la tabla adjunta)

Total de días cursados en ${mes} ${anio}: ${totalDias} días.

La presente constancia se expide a solicitud de la parte interesada para los fines que estime pertinentes.

Atentamente,`;
  }

  return `${dest}:

Por medio de la presente, XpertCode S.R.L. hace constar que el/la Sr./Sra. ${emp.nombre}, titular de la cédula de identidad ${emp.cedula}, labora en nuestra organización desde el ${emp.ingreso} en el cargo de ${emp.posicion}, actualmente destacado en ${emp.cliente}.

${inclSalario ? `Su remuneración mensual actual es de ${salario}.\n\n` : ""}La presente constancia se expide a solicitud de la parte interesada para los fines que estime pertinentes.

Atentamente,`;
}

function buildReferencia(d: {
  empresa: string; rnc: string; ciudad: string; nombre: string; cedula: string;
  cargo: string; ingreso: string; salario: string; firmante: string;
  cedulaFirmante: string; cargoFirmante: string; telefono: string;
}) {
  const fecha = new Date().toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" });
  return `${d.ciudad}, ${fecha}

Atención:
A quien pueda interesar

Por medio de la presente yo, ${d.firmante}, portador y titular de la Cédula de Identidad y Electoral No. ${d.cedulaFirmante}, representante de la empresa ${d.empresa}, con RNC ${d.rnc}, les informa que el Sr. ${d.nombre} se desempeña en el cargo de ${d.cargo}, siendo el mismo portador de la cédula de identidad No. ${d.cedula}; y labora con nosotros desde el ${d.ingreso} devengando un salario mensual de ${d.salario}.

Atentamente,



${d.firmante}
${d.cargoFirmante}
Celular ${d.telefono}`;
}
