export interface Ajuste {
  fecha: string;
  tipo: string;
  salario: string;
  fechaEfectiva: string;
}

export interface Vacacion {
  periodo: string;
  rango: string;
  dias: string;
}

export interface AjusteExpense {
  fecha: string;
  tipo: string;
  montoAnterior: number;
  montoNuevo: number;
  fechaEfectiva: string;
}

export interface AjusteSalarial {
  id: string;
  empleadoId: number;
  nombreEmpleado: string;
  salarioAnterior: number | string | null;
  salarioNuevo: number | string;
  diferencia: number | string | null;
  porcentajeCambio: number | string | null;
  moneda: string;
  fechaEfectiva: string;
  motivo: string;
  observaciones: string;
  creadoEn: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  posicion: string;
  departamento: string;
  cedula: string;
  fechaNacimiento: string;
  ingreso: string;
  estatus: "Activo" | "Inactivo";
  fechaSalida?: string;
  motivoSalida?: "Desahucio" | "Renuncia" | "";
  email: string;
  telefono: string;
  numeroCuenta: string;
  banco: string;
  supervisor: string;
  comentario: string;
  cliente: string;
  salarioActual?: number | string | null;
  monedaSalarioActual?: string | null;
  ajustesSalariales?: AjusteSalarial[];
  ajustes: Ajuste[];
  vacaciones: Vacacion[];
  ajustesExpenses: AjusteExpense[];
}

export const empleados: Empleado[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    posicion: "Desarrollador Senior",
    departamento: "Tecnología",
    cedula: "001-1234567-8",
    fechaNacimiento: "15 mar 1992",
    ingreso: "15 ene 2025",
    estatus: "Activo",
    email: "juan.perez@empresa.com",
    telefono: "809-555-0101",
    numeroCuenta: "2100045678",
    banco: "Banco Popular Dominicano",
    supervisor: "Carlos Martínez",
    comentario: "",
    cliente: "Banco Popular Dominicano",
    ajustes: [
      { fecha: "01 ago 2026", tipo: "Aumento",  salario: "RD$ 45,000", fechaEfectiva: "01 ago 2026" },
      { fecha: "01 jun 2025", tipo: "Aumento",  salario: "RD$ 40,000", fechaEfectiva: "01 jun 2025" },
      { fecha: "15 ene 2025", tipo: "Ingreso",  salario: "RD$ 35,000", fechaEfectiva: "15 ene 2025" },
    ],
    vacaciones: [
      { periodo: "2026", rango: "05–11 ene", dias: "7" },
      { periodo: "2026", rango: "10–16 ago", dias: "7" },
      { periodo: "2025", rango: "20–27 jul", dias: "8" },
    ],
    ajustesExpenses: [
      { fecha: "01 ago 2026", tipo: "Aumento", montoAnterior: 4000, montoNuevo: 5000, fechaEfectiva: "01 ago 2026" },
      { fecha: "15 ene 2025", tipo: "Asignación inicial", montoAnterior: 0, montoNuevo: 4000, fechaEfectiva: "15 ene 2025" },
    ],
  },
  {
    id: 2,
    nombre: "María Gómez",
    posicion: "QA Analyst",
    departamento: "Tecnología",
    cedula: "001-9876543-2",
    fechaNacimiento: "02 sep 1995",
    ingreso: "03 mar 2023",
    estatus: "Activo",
    email: "maria.gomez@empresa.com",
    telefono: "809-555-0202",
    numeroCuenta: "3200198765",
    banco: "Banco BHD León",
    supervisor: "Carlos Martínez",
    comentario: "Excelente desempeño en pruebas de regresión.",
    cliente: "Claro República Dominicana",
    ajustes: [
      { fecha: "01 ene 2026", tipo: "Promoción", salario: "RD$ 52,000", fechaEfectiva: "01 ene 2026" },
      { fecha: "03 mar 2023", tipo: "Ingreso",   salario: "RD$ 38,000", fechaEfectiva: "03 mar 2023" },
    ],
    vacaciones: [{ periodo: "2026", rango: "05–19 ene", dias: "14" }],
    ajustesExpenses: [
      { fecha: "01 ene 2026", tipo: "Aumento", montoAnterior: 3500, montoNuevo: 5000, fechaEfectiva: "01 ene 2026" },
      { fecha: "03 mar 2023", tipo: "Asignación inicial", montoAnterior: 0, montoNuevo: 3500, fechaEfectiva: "03 mar 2023" },
    ],
  },
  {
    id: 3,
    nombre: "Carlos Read",
    posicion: "Backend Developer",
    departamento: "Tecnología",
    cedula: "001-4561237-9",
    fechaNacimiento: "28 dic 1990",
    ingreso: "10 ago 2024",
    estatus: "Activo",
    email: "carlos.read@empresa.com",
    telefono: "809-555-0303",
    numeroCuenta: "4100334455",
    banco: "Banco Popular Dominicano",
    supervisor: "Carlos Martínez",
    comentario: "",
    cliente: "Banco Popular Dominicano",
    ajustes: [
      { fecha: "10 ago 2024", tipo: "Ingreso", salario: "RD$ 41,000", fechaEfectiva: "10 ago 2024" },
    ],
    vacaciones: [],
    ajustesExpenses: [
      { fecha: "10 ago 2024", tipo: "Asignación inicial", montoAnterior: 0, montoNuevo: 5000, fechaEfectiva: "10 ago 2024" },
    ],
  },
  {
    id: 4,
    nombre: "Laura Méndez",
    posicion: "Diseñadora UX",
    departamento: "Producto",
    cedula: "001-7894561-3",
    fechaNacimiento: "10 jun 1993",
    ingreso: "05 feb 2022",
    estatus: "Activo",
    email: "laura.mendez@empresa.com",
    telefono: "809-555-0404",
    numeroCuenta: "5200667788",
    banco: "Scotiabank",
    supervisor: "Andrea Reyes",
    comentario: "Candidata a promoción Q1 2027.",
    cliente: "Seguros Universal",
    ajustes: [
      { fecha: "01 feb 2026", tipo: "Aumento", salario: "RD$ 58,000", fechaEfectiva: "01 feb 2026" },
      { fecha: "01 feb 2024", tipo: "Aumento", salario: "RD$ 50,000", fechaEfectiva: "01 feb 2024" },
      { fecha: "05 feb 2022", tipo: "Ingreso", salario: "RD$ 42,000", fechaEfectiva: "05 feb 2022" },
    ],
    vacaciones: [
      { periodo: "2026", rango: "15–29 mar", dias: "14" },
      { periodo: "2025", rango: "01–14 ago", dias: "14" },
      { periodo: "2024", rango: "10–17 nov", dias: "8" },
    ],
    ajustesExpenses: [
      { fecha: "01 feb 2026", tipo: "Aumento",            montoAnterior: 4500, montoNuevo: 5000, fechaEfectiva: "01 feb 2026" },
      { fecha: "01 feb 2024", tipo: "Aumento",            montoAnterior: 3000, montoNuevo: 4500, fechaEfectiva: "01 feb 2024" },
      { fecha: "05 feb 2022", tipo: "Asignación inicial", montoAnterior: 0,    montoNuevo: 3000, fechaEfectiva: "05 feb 2022" },
    ],
  },
  {
    id: 5,
    nombre: "Roberto Soto",
    posicion: "Gerente de Proyecto",
    departamento: "Operaciones",
    cedula: "001-3214569-7",
    fechaNacimiento: "22 ene 1985",
    ingreso: "01 sep 2020",
    estatus: "Inactivo",
    fechaSalida: "31 ago 2025",
    motivoSalida: "Renuncia",
    email: "roberto.soto@empresa.com",
    telefono: "809-555-0505",
    numeroCuenta: "6300112233",
    banco: "Banco BHD León",
    supervisor: "Dirección General",
    comentario: "Salida voluntaria. Recontratable.",
    cliente: "AES Dominicana",
    ajustes: [
      { fecha: "01 sep 2023", tipo: "Aumento",   salario: "RD$ 75,000", fechaEfectiva: "01 oct 2023" },
      { fecha: "01 sep 2021", tipo: "Promoción", salario: "RD$ 65,000", fechaEfectiva: "01 oct 2021" },
      { fecha: "01 sep 2020", tipo: "Ingreso",   salario: "RD$ 55,000", fechaEfectiva: "01 sep 2020" },
    ],
    vacaciones: [
      { periodo: "2025", rango: "01–21 dic", dias: "21" },
      { periodo: "2024", rango: "05–18 ago", dias: "14" },
    ],
    ajustesExpenses: [],
  },
];
