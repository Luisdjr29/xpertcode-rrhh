import { AjusteSalarial, Empleado, empleados as seed } from "./data";

const STORAGE_KEY = "xpertcode_rrhh_empleados";

function readInitialState(): Empleado[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...seed];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Empleado[];
    }
  } catch {
    // Ignore invalid storage values and fall back to the seeded list.
  }

  return [...seed];
}

function persistState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or browser restrictions.
  }
}

// Simple in-memory reactive store using a subscriber pattern
let state: Empleado[] = readInitialState();
let nextId = state.reduce((max, emp) => Math.max(max, emp.id), 0) + 1;
const listeners = new Set<() => void>();

export function getEmpleados() {
  return state;
}

export function replaceEmpleados(empleados: Empleado[]) {
  state = empleados;
  nextId = state.reduce((max, emp) => Math.max(max, emp.id), 0) + 1;
  persistState();
  notify();
}

export function addEmpleadoFromServer(empleado: Empleado) {
  state = [empleado, ...state.filter((current) => current.id !== empleado.id)];
  nextId = Math.max(nextId, empleado.id + 1);
  persistState();
  notify();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function addEmpleado(emp: Omit<Empleado, "id" | "ajustes" | "vacaciones" | "ajustesExpenses">) {
  const nuevo: Empleado = {
    ...emp,
    id: nextId++,
    ajustes: [],
    vacaciones: [],
    ajustesExpenses: [],
  };
  state = [nuevo, ...state];
  persistState();
  notify();
  return nuevo.id;
}

export function updateEmpleado(id: number, patch: Partial<Omit<Empleado, "id" | "ajustes" | "vacaciones" | "ajustesExpenses">>) {
  state = state.map((e) => (e.id === id ? { ...e, ...patch } : e));
  persistState();
  notify();
}

export function updateEmpleadoFull(id: number, patch: Partial<Empleado>) {
  state = state.map((e) => (e.id === id ? { ...e, ...patch } : e));
  persistState();
  notify();
}

function persistSalaryState(nextState: Empleado[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    throw new Error("No se pudo guardar el ajuste en el almacenamiento local del navegador.");
  }
}

export function guardarAjusteSalarialLocal(id: number, ajuste: AjusteSalarial) {
  const empleado = state.find((current) => current.id === id);
  if (!empleado) {
    throw new Error("No se encontró el empleado seleccionado.");
  }

  const nextState = state.map((current) =>
    current.id === id
      ? {
          ...current,
          salarioActual: ajuste.salarioNuevo,
          monedaSalarioActual: ajuste.moneda,
          ajustesSalariales: [ajuste, ...(current.ajustesSalariales ?? [])],
        }
      : current,
  );

  persistSalaryState(nextState);
  state = nextState;
  notify();
}
