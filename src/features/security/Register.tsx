import React, { useState } from "react";
import { supabase, signInWithGoogle } from "../../core/services/supabase";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      alert("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-gray-50">
      <div className="w-full md:w-2/4 bg-white shadow-sm border border-gray-200 rounded px-8 py-12 flex flex-col justify-center">
        <h2 className="text-3xl font-black mb-6 text-gray-900 tracking-widest text-center">Crear cuenta</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
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
          <div>
            <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="block mb-2 text-gray-500">O</span>
          <button
            onClick={handleGoogle}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M21.35 11.1H12V13.9H17.95C17.55 15.3 16.45 16.4 15.05 16.9V19.1H17.95C20.15 17.1 21.35 14.3 21.35 11.1Z" fill="#4285F4"/><path d="M12 21C14.43 21 16.47 20.2 17.95 19.1L15.05 16.9C14.23 17.3 13.2 17.5 12 17.5C9.65 17.5 7.7 15.9 7.05 13.8H4.05V16C5.53 18.2 8.53 21 12 21Z" fill="#34A853"/><path d="M7.05 13.8C6.85 13.4 6.75 13 6.75 12.5C6.75 12 6.85 11.6 7.05 11.2V9H4.05C3.38 10.2 3 11.5 3 12.5C3 13.5 3.38 14.8 4.05 16L7.05 13.8Z" fill="#FBBC05"/><path d="M12 7.5C13.2 7.5 14.23 7.7 15.05 8.1L17.95 5.9C16.47 4.8 14.43 4 12 4C8.53 4 5.53 6.8 4.05 9L7.05 11.2C7.7 9.1 9.65 7.5 12 7.5Z" fill="#EA4335"/></g></svg>
            Registrarse con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
