import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css"
import { loginUsuario } from "../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !pass) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Introduce un correo electrónico válido.");
            return;
        }

        try {
            setLoading(true);

            await loginUsuario(email, pass);

            navigate("/", {
                replace: true,
                state: {
                    message: "Has iniciado sesión correctamente."
                }
            });

        } catch (err) {
            setError(
                err.message || "No se ha podido iniciar sesión."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login">
            <div className="login-container">
                <div className="login-header">
                    <img src="/images/Logo.png" alt="" className="login-logo" />
                    <h1>The Power</h1>
                    <p>Inicia sesón para poder disfrutar de tu música</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input id="email" type="email" placeholder="ejemplo@correo.com" autoComplete="email" value={email} onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Contraseña</label>
                        <div className="pass-container">
                            <input id="pass" type={showPass ? "text" : "password"} placeholder="Introduce tu contraseña" value={pass} onChange={(e) => { setPass(e.target.value); setError(""); }} required />
                            <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} aria-label={showPass ? "ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPass}>
                                {showPass ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </form>
                <p className="login-register">¿Aún no tienes cuenta?{" "}
                    <Link to="/registro" className="login-register">Regístrate</Link>
                </p>
                <Link to="/" className="login-back">Volver al inicio</Link>
            </div>
        </main>
    );
}

export default Login