import { useState } from "react";
import { Empleado } from "../data";

interface FormEmpleadoProps {
  empleado?: Empleado;
  onBack: () => void;
  onSave: (data: Omit<Empleado, "id" | "ajustes" | "vacaciones" | "ajustesExpenses">) => Promise<void>;
}

const departamentos = ["Tecnología", "Producto", "Operaciones", "Recursos Humanos", "Finanzas", "Ventas"];
const clientes = [
  "Banco Popular Dominicano", "Claro República Dominicana", "Seguros Universal",
  "AES Dominicana", "Banco BHD León", "Orange Dominicana", "Otro",
];
const bancos = [
  "Banco Popular Dominicano", "Banco BHD León", "Scotiabank",
  "Banreservas", "Banco Santa Cruz", "Otro",
];
const estatuses = ["Activo", "Inactivo"] as const;
const motivosSalida = ["Desahucio", "Renuncia"] as const;

type Field = keyof Omit<Empleado, "id" | "ajustes" | "vacaciones" | "ajustesExpenses">;

function initial(emp?: Empleado) {
  return {
    nombre:          emp?.nombre          ?? "",
    posicion:        emp?.posicion        ?? "",
    departamento:    emp?.departamento    ?? departamentos[0],
    cedula:          emp?.cedula          ?? "",
    fechaNacimiento: emp?.fechaNacimiento ?? "",
    ingreso:         emp?.ingreso         ?? "",
    estatus:         emp?.estatus         ?? "Activo",
    fechaSalida:     emp?.fechaSalida     ?? "",
    motivoSalida:    emp?.motivoSalida    ?? "",
    email:           emp?.email           ?? "",
    telefono:        emp?.telefono        ?? "",
    numeroCuenta:    emp?.numeroCuenta    ?? "",
    banco:           emp?.banco           ?? bancos[0],
    supervisor:      emp?.supervisor      ?? "",
    comentario:      emp?.comentario      ?? "",
    cliente:         emp?.cliente         ?? clientes[0],
  };
}

function toISO(display: string) {
  const d = new Date(display);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FormEmpleado({ empleado, onBack, onSave }: FormEmpleadoProps) {
  const [form, setForm] = useState(initial(empleado));
  const [ingresoRaw, setIngresoRaw]       = useState(() => toISO(empleado?.ingreso ?? ""));
  const [nacimientoRaw, setNacimientoRaw] = useState(() => toISO(empleado?.fechaNacimiento ?? ""));
  const [salidaRaw, setSalidaRaw]         = useState(() => toISO(empleado?.fechaSalida ?? ""));
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const esNuevo = !empleado;

  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!form.nombre.trim())   e.nombre   = "Requerido";
    if (!form.posicion.trim()) e.posicion = "Requerido";
    if (!form.cedula.trim())   e.cedula   = "Requerido";
    if (!form.email.trim())    e.email    = "Requerido";
    if (!form.ingreso.trim())  e.ingreso  = "Requerido";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setSaveError("");
    try {
      await onSave(form as Omit<Empleado, "id" | "ajustes" | "vacaciones" | "ajustesExpenses">);
      setSaved(true);
      setTimeout(() => { setSaved(false); onBack(); }, 800);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar el empleado.");
    } finally {
      setSaving(false);
    }
  }

  const showExitFields = form.estatus === "Inactivo";

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Left panel */}
      <div className="w-64 shrink-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
          <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-colors">
            <svg className="w-4 h-4 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-semibold text-[var(--foreground)]">
              {esNuevo ? "Nuevo empleado" : "Editar empleado"}
            </h1>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              {esNuevo ? "Completa los datos" : empleado.nombre}
            </p>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-semibold shrink-0">
            {form.nombre ? form.nombre.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() : "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--foreground)] truncate">{form.nombre || "Nombre del empleado"}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] truncate">{form.posicion || "Cargo"}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-[11px] text-[var(--accent)] font-medium truncate">{form.cliente}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-2">Estatus</p>
          <div className="flex gap-2">
            {estatuses.map((s) => (
              <button key={s} onClick={() => set("estatus", s)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-[var(--radius)] border transition-colors ${
                  form.estatus === s
                    ? s === "Activo" ? "bg-emerald-600 text-white border-emerald-600" : "bg-red-500 text-white border-red-500"
                    : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Quick summary */}
        {!esNuevo && (
          <div className="px-5 py-4 border-b border-[var(--border)] space-y-2">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Info rápida</p>
            {[
              { label: "Teléfono", value: form.telefono || "—" },
              { label: "Banco", value: form.banco },
              { label: "Supervisor", value: form.supervisor || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center gap-2">
                <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">{label}</span>
                <span className="text-[10px] font-medium text-[var(--foreground)] truncate text-right">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <div className="px-5 py-4 border-t border-[var(--border)]">
          {saveError && <p role="alert" className="text-[11px] text-red-600 mb-2">{saveError}</p>}
          <button onClick={() => void handleSubmit()} disabled={saving}
            className={`w-full py-2 text-xs font-semibold rounded-[var(--radius)] transition-all ${
              saved ? "bg-emerald-600 text-white" : "bg-[var(--accent)] text-white hover:bg-green-800 disabled:opacity-60"
            }`}>
            {saving ? "Guardando..." : saved ? "✓ Guardado" : esNuevo ? "Crear empleado" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">

          {/* Información personal */}
          <Section title="Información personal">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre completo" error={errors.nombre} required>
                <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Ej. Juan Pérez" className={inp(!!errors.nombre)} />
              </Field>
              <Field label="Cédula de identidad" error={errors.cedula} required>
                <input value={form.cedula} onChange={(e) => set("cedula", e.target.value)}
                  placeholder="001-0000000-0" className={inp(!!errors.cedula)} />
              </Field>
              <Field label="Fecha de nacimiento">
                <input type="date" value={nacimientoRaw}
                  onChange={(e) => { setNacimientoRaw(e.target.value); set("fechaNacimiento", fmtDate(e.target.value)); }}
                  className={inp(false)} />
              </Field>
              <Field label="Número de contacto">
                <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)}
                  placeholder="809-000-0000" className={inp(false)} />
              </Field>
              <Field label="Correo electrónico" error={errors.email} required>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="correo@empresa.com" className={inp(!!errors.email)} />
              </Field>
            </div>
          </Section>

          {/* Información bancaria */}
          <Section title="Información bancaria">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Número de cuenta">
                <input value={form.numeroCuenta} onChange={(e) => set("numeroCuenta", e.target.value)}
                  placeholder="0000000000" className={inp(false)} />
              </Field>
              <Field label="Institución bancaria">
                <select value={form.banco} onChange={(e) => set("banco", e.target.value)} className={inp(false)}>
                  {bancos.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Información laboral */}
          <Section title="Información laboral">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cargo / Posición" error={errors.posicion} required>
                <input value={form.posicion} onChange={(e) => set("posicion", e.target.value)}
                  placeholder="Ej. Desarrollador Senior" className={inp(!!errors.posicion)} />
              </Field>
              <Field label="Departamento">
                <select value={form.departamento} onChange={(e) => set("departamento", e.target.value)} className={inp(false)}>
                  {departamentos.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Supervisor directo">
                <input value={form.supervisor} onChange={(e) => set("supervisor", e.target.value)}
                  placeholder="Nombre del supervisor" className={inp(false)} />
              </Field>
              <Field label="Empresa cliente">
                <select value={form.cliente} onChange={(e) => set("cliente", e.target.value)} className={inp(false)}>
                  {clientes.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Fecha de ingreso" error={errors.ingreso} required>
                <input type="date" value={ingresoRaw}
                  onChange={(e) => { setIngresoRaw(e.target.value); set("ingreso", fmtDate(e.target.value)); }}
                  className={inp(!!errors.ingreso)} />
              </Field>
            </div>
          </Section>

          {/* Salida — solo si Inactivo */}
          {showExitFields && (
            <Section title="Información de salida">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de salida">
                  <input type="date" value={salidaRaw}
                    onChange={(e) => { setSalidaRaw(e.target.value); set("fechaSalida", fmtDate(e.target.value)); }}
                    className={inp(false)} />
                </Field>
                <Field label="Motivo de salida">
                  <select value={form.motivoSalida} onChange={(e) => set("motivoSalida", e.target.value)} className={inp(false)}>
                    <option value="">Seleccionar</option>
                    {motivosSalida.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </Field>
              </div>
            </Section>
          )}

          {/* Comentarios */}
          <Section title="Comentarios">
            <textarea value={form.comentario} onChange={(e) => set("comentario", e.target.value)}
              rows={3} placeholder="Notas internas sobre el empleado..."
              className={`${inp(false)} resize-none`} />
          </Section>

          {!esNuevo && (
            <div className="bg-amber-50 border border-amber-200 rounded-[var(--radius-lg)] p-4 flex gap-3">
              <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-amber-800">
                Los ajustes de salario y expenses se gestionan desde la pantalla de Ajustes del empleado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function inp(hasError: boolean) {
  return `w-full text-xs px-3 py-2 border rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors ${
    hasError ? "border-red-400 focus:ring-red-400" : "border-[var(--border)]"
  }`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-[var(--muted-foreground)] mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-[var(--border)]" />
        {title}
        <span className="flex-1 h-px bg-[var(--border)]" />
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children, error, required }: {
  label: string; children: React.ReactNode; error?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
