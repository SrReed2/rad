"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Completa usuario y contraseña.");
      return;
    }

    setLoading(true);
    const ok = await login(username.trim(), password);
    setLoading(false);

    if (ok) {
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white p-10 rounded-2xl shadow-xl w-[420px] border border-gray-800"
    >
      {/* Logo / título */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#F9F8F6" }}
        >
          <img src="/brand/sofia-icon.png" alt="SOFÍA" className="w-20 h-20" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-[#1F2E3D] mt-4 tracking-tight">
          SOFÍA
        </h1>
        <p className="text-gray-400 text-sm mt-1 tracking-widest uppercase">
          Panel Académico
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {/* Campo usuario */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Usuario
        </label>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          disabled={loading}
          className="
            w-full p-3 rounded-lg
            bg-[#F6EFE0] text-[#26313D]
            border border-gray-700
            focus:border-[#14495C] focus:outline-none
            transition-colors
            disabled:opacity-50
          "
        />
      </div>

      {/* Campo contraseña */}
      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
          className="
            w-full p-3 rounded-lg
            bg-[#F6EFE0] text-[#26313D]
            border border-gray-700
            focus:border-[#14495C] focus:outline-none
            transition-colors
            disabled:opacity-50
          "
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full bg-[#14495C] hover:bg-[#0F3646]
          transition-colors text-white font-bold
          p-3 rounded-lg text-base
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            Verificando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      {/* Credenciales demo */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Demo: <span className="text-gray-400">admin / admin123</span>
      </p>
    </form>
  );
}
