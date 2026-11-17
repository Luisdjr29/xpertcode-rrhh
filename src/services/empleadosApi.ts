import { Empleado } from "../data";
import { apiGet, apiPost, apiPut } from "./api";

export type EmpleadoInput = Omit<
  Empleado,
  "id" | "salarioActual" | "monedaSalarioActual" | "ajustes" | "vacaciones" | "ajustesExpenses"
> & Partial<Pick<Empleado, "ajustes" | "vacaciones" | "ajustesExpenses">> & { id?: number };

export async function obtenerEmpleados(): Promise<Empleado[]> {
  const response = await apiGet<Empleado[]>("/api/empleados");
  if (!Array.isArray(response)) {
    throw new Error("El servidor devolvió una lista de empleados inválida.");
  }
  return response;
}

export async function crearEmpleado(datos: EmpleadoInput): Promise<Empleado> {
  const response = await apiPost<EmpleadoInput, Empleado>("/api/empleados", datos);
  if (!response) throw new Error("El servidor no devolvió el empleado creado.");
  return response;
}

export async function actualizarEmpleado(id: number, datos: EmpleadoInput): Promise<Empleado> {
  const response = await apiPut<EmpleadoInput, Empleado>(`/api/empleados/${id}`, datos);
  if (!response) throw new Error("El servidor no devolvió el empleado actualizado.");
  return response;
}
