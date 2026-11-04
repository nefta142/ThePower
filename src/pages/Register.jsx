import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "./Register.css"
import "./Login.css"

function registro() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [confirmPass, setConfirmPass] = useState();

    const [showPass, setShowPass] = useState();
    const [error, setError] = useState();



    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !name.trim() ||
            !email.trim() ||
            !pass.trim() ||
            !confirmPass.trim()
        ) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (name.trim().length < 2) {
            setError("Introduce un nombre válido.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Introduce un correo electrónico válido.");
            return;
        }

        if (pass.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (pass !== confirmPass) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError("El registro todavía no está conectado al servidor.");
    };

    return (
        <main className="register">
            <div className="login-container">
                <div className="login-header">
                    <img
                        src="/images/Logo.png"
                        alt=""
                        className="login-logo"
                    />

                    <h1>Crear cuenta</h1>
                    <p>
                        Regístrate para disfrutar de toda tu música.
                    </p>
                </div>


                <form className="login-form" onSubmit={handleSubmit} noValidate>

                    <div className="form-group">
                        <label htmlFor="name">Nombre completo</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre y apellidos"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Correo electrónico</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="form-group">
                        <label htmlFor="register-pass">Contraseña</label>

                        <div className="pass-container">
                            <input
                                id="register-pass"
                                type={showPass ? "text" : "password"}
                                placeholder="Crea una contraseña"
                                autoComplete="new-password"
                                value={pass}
                                onChange={(e) => {
                                    setPass(e.target.value);
                                    setError("");
                                }}
                                required
                            />

                            <button
                                type="button"
                                className="pass-toggle"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={
                                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                                aria-pressed={showPass}
                            >
                                {showPass
                                    ? <EyeOff aria-hidden="true" />
                                    : <Eye aria-hidden="true" />}
                            </button>
                        </div>

                        <small className="register-hint">
                            Mínimo 8 caracteres.
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-pass">Confirmar contraseña</label>

                        <div className="pass-container">
                            <input
                                id="confirm-pass"
                                type={showPass ? "text" : "password"}
                                placeholder="Repite tu contraseña"
                                autoComplete="new-password"
                                value={confirmPass}
                                onChange={(e) => {
                                    setConfirmPass(e.target.value);
                                    setError("");
                                }}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-button">
                        Crear cuenta
                    </button>

                </form>


                <p className="login-register">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </main>
    );
}

export default registro