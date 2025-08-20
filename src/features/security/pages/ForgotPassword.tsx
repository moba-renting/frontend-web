import React, { useState } from "react";
import { supabase } from "../../../core/services/supabase";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password"
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Enlace de recuperación enviado. Revisa tu correo electrónico.");
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-gray-50">
      <div className="w-full md:w-2/4 bg-white shadow-sm border border-gray-200 rounded px-8 py-12 flex flex-col justify-center">
        <h2 className="text-3xl font-black mb-6 text-gray-900 tracking-widest text-center">Recuperar contraseña</h2>
        <form onSubmit={handleForgot} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
