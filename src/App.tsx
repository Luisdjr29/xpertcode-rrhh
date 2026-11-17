import { useState, useSyncExternalStore } from "react";
import { Empleado } from "./data";
import { addEmpleado, getEmpleados, subscribe, updateEmpleadoFull } from "./store";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import GenerarCarta from "./components/GenerarCarta";
import FormEmpleado from "./components/FormEmpleado";
import GestionAjustes from "./components/GestionAjustes";

type View = "dashboard" | "carta" | "nuevo" | "editar" | "ajustes";

export default function App() {
  const empleados = useSyncExternalStore(subscribe, getEmpleados);
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [selectedEmp, setSelectedEmp] = useState<Empleado | null>(null);

  if (!authed) {
    return <div className="h-full"><Login onLogin={() => setAuthed(true)} /></div>;
  }

  if (view === "carta" && selectedEmp) {
    return (
      <div className="h-full">
        <GenerarCarta
          empleado={selectedEmp}
          onBack={() => setView("dashboard")}
        />
      </div>
    );
  }

  if (view === "nuevo") {
    return (
      <div className="h-full">
        <FormEmpleado
          onBack={() => setView("dashboard")}
          onSave={async (data) => {
            addEmpleado(data);
          }}
        />
      </div>
    );
  }

  if (view === "editar" && selectedEmp) {
    return (
      <div className="h-full">
        <FormEmpleado
          empleado={selectedEmp}
          onBack={() => setView("dashboard")}
          onSave={async (data) => {
            updateEmpleadoFull(selectedEmp.id, data);
            setSelectedEmp({ ...selectedEmp, ...data });
          }}
        />
      </div>
    );
  }

  if (view === "ajustes" && selectedEmp) {
    const live = empleados.find((e) => e.id === selectedEmp.id) ?? selectedEmp;
    return (
      <div className="h-full">
        <GestionAjustes
          empleado={live}
          empleados={empleados}
          onSelectEmpleado={setSelectedEmp}
          onBack={() => setView("dashboard")}
          onSave={(patch) => updateEmpleadoFull(live.id, patch)}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Dashboard
        empleados={empleados}
        onGenerarCarta={(emp: Empleado) => {
          setSelectedEmp(emp);
          setView("carta");
        }}
        onNuevoEmpleado={() => setView("nuevo")}
        onEditarEmpleado={(emp: Empleado) => {
          setSelectedEmp(emp);
          setView("editar");
        }}
        onGestionarAjustes={(emp: Empleado) => { setSelectedEmp(emp); setView("ajustes"); }}
        onLogout={() => { setAuthed(false); setView("dashboard"); }}
      />
    </div>
  );
}
