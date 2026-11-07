import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { logoutUsuario } from "../services/authService";

function Profile() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setLoading(true);

    try {
      await logoutUsuario();

      navigate("/", {
        replace: true,
        state: {
          message: "Has cerrado sesión correctamente."
        }
      });
    } catch (err) {
      setError(err.message || "No se pudo cerrar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile">
      <h1>Mi perfil</h1>

      <p>Bienvenido, {user.nombreUsuario}.</p>
      <p>Correo electrónico: {user.email}</p>

      {error && (
        <p role="alert" className="login-error">
          {error}
        </p>
      )}

      <button
        type="button"
        className="login-button"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>

      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default Profile;

