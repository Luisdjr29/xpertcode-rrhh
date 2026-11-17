import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

const DEMO_USER = "admin@xpertcode.com";
const DEMO_PASS = "xpertcode2026";

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === DEMO_USER && password === DEMO_PASS) {
        onLogin();
      } else {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      }
    }, 700);
  }

  return (
    <div className="h-full flex bg-[var(--background)]">
      {/* Left branding panel */}
      <div className="hidden md:flex w-[420px] shrink-0 flex-col bg-[#1a5c38] relative overflow-hidden">
        {/* Dot-grid decoration */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#2b8a57] opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#f5a623] opacity-10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.15"/>
              <path d="M8 8L20 20L8 32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 8L20 20L32 32" stroke="#f5a623" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="text-white font-bold text-base leading-tight">XpertCode</p>
              <p className="text-white/50 text-[10px] tracking-widest uppercase leading-tight">Software Factory</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">Portal administrativo</p>
            <h1 className="text-white text-3xl font-bold leading-tight mb-4">
              Gestión de<br />Recursos Humanos
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Administra empleados, historial salarial, expenses y genera documentos laborales desde un solo lugar.
            </p>

            {/* Feature list */}
            <div className="mt-10 space-y-3">
              {[
                "Maestro de empleados",
                "Historial de ajustes salariales",
                "Control de expenses",
                "Generación de cartas laborales",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f5a623]/20 border border-[#f5a623]/40 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#f5a623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-[10px]">© 2026 XpertCode S.R.L. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#2b8a57"/>
            <path d="M8 8L20 20L8 32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M32 8L20 20L32 32" stroke="#f5a623" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-[var(--foreground)]">XpertCode</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Iniciar sesión</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Accede con tu cuenta de administrador</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@xpertcode.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)] block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)] outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-[var(--radius)]">
                <svg className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-semibold bg-[var(--accent)] text-white rounded-[var(--radius)] hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Verificando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] space-y-1">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">Credenciales de demo</p>
            <p className="text-[11px] text-[var(--foreground)] font-['DM_Mono',monospace]">{DEMO_USER}</p>
            <p className="text-[11px] text-[var(--foreground)] font-['DM_Mono',monospace]">{DEMO_PASS}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
