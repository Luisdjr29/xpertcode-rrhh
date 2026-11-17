import { AjusteSalarial } from "../data";
import { getEmpleados, guardarAjusteSalarialLocal } from "../store";

export type { AjusteSalarial } from "../data";

export interface CrearAjusteSalarialInput {
  salarioNuevo: string;
  moneda: "DOP" | "USD";
  fechaEfectiva: string;
  motivo: string;
  observaciones: string;
}

export async function obtenerAjustesSalariales(empleadoId: number): Promise<AjusteSalarial[]> {
  const empleado = getEmpleados().find((current) => current.id === empleadoId);
  if (!empleado) {
    throw new Error("No se encontró el empleado seleccionado.");
  }
  return [...(empleado.ajustesSalariales ?? [])].sort((a, b) =>
    b.fechaEfectiva.localeCompare(a.fechaEfectiva) || b.creadoEn.localeCompare(a.creadoEn),
  );
}

export async function crearAjusteSalarial(
  empleadoId: number,
  datos: CrearAjusteSalarialInput,
): Promise<AjusteSalarial> {
  const empleado = getEmpleados().find((current) => current.id === empleadoId);
  if (!empleado) {
    throw new Error("No se encontró el empleado seleccionado.");
  }

  if (!/^\d{1,15}(?:\.\d{1,2})?$/.test(datos.salarioNuevo)) {
    throw new Error("El salario debe tener hasta 15 enteros y 2 decimales.");
  }
  const newSalary = Number(datos.salarioNuevo);
  if (!Number.isFinite(newSalary) || newSalary <= 0) {
    throw new Error("El salario nuevo debe ser mayor que cero.");
  }
  if (!datos.fechaEfectiva || !datos.motivo.trim()) {
    throw new Error("Completa la fecha efectiva y el motivo del ajuste.");
  }
  if (datos.moneda !== "DOP" && datos.moneda !== "USD") {
    throw new Error("La moneda permitida es DOP o USD.");
  }

  const previousSalary = empleado.salarioActual == null ? null : Number(empleado.salarioActual);
  const currency = empleado.monedaSalarioActual ?? datos.moneda;
  if (previousSalary !== null && previousSalary === newSalary) {
    throw new Error("El salario nuevo no puede ser igual al salario actual.");
  }
  if (previousSalary !== null && currency !== datos.moneda) {
    throw new Error("La moneda del nuevo salario debe coincidir con la moneda actual.");
  }

  const difference = previousSalary === null
    ? null
    : Math.round((newSalary - previousSalary) * 100) / 100;
  const adjustment: AjusteSalarial = {
    id: crypto.randomUUID(),
    empleadoId,
    nombreEmpleado: empleado.nombre,
    salarioAnterior: empleado.salarioActual ?? null,
    salarioNuevo: datos.salarioNuevo,
    diferencia: difference,
    porcentajeCambio: previousSalary === null || previousSalary === 0
      ? null
      : Number((((newSalary - previousSalary) / previousSalary) * 100).toFixed(2)),
    moneda: datos.moneda,
    fechaEfectiva: datos.fechaEfectiva,
    motivo: datos.motivo.trim(),
    observaciones: datos.observaciones.trim(),
    creadoEn: new Date().toISOString(),
  };

  guardarAjusteSalarialLocal(empleadoId, adjustment);
  return adjustment;
}
